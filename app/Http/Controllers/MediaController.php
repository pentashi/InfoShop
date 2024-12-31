<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\File;
use App\Models\Product;
use App\Models\Attachment;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class MediaController extends Controller
{
    public function index()
    {
        $basePath = storage_path('app/public/uploads'); // Base directory path

        function getAllFilesAsUrls($path)
        {
            $files = File::files($path); // Get files in the current directory
            $allFiles = array_map(function ($file) {
                return [
                    'url' => asset(str_replace(storage_path('app/public'), 'storage', $file->getPathname())), // File URL
                    'name' => $file->getFilename(), // File name
                    'size' => round($file->getSize() / 1024, 2) . ' KB', // File size in KB
                    'date' => date('Y-m-d H:i:s', $file->getMTime()),
                ];
            }, $files);

            // Get subdirectories
            $subdirectories = File::directories($path);

            // Loop through subdirectories recursively
            foreach ($subdirectories as $subdirectory) {
                $allFiles = array_merge($allFiles, getAllFilesAsUrls($subdirectory));
            }

            return $allFiles;
        }

        // Fetch all files grouped by directories
        // $images = getFilesByDirectory($basePath);
        $images = getAllFilesAsUrls($basePath);
        // Pass the data to the view
        return Inertia::render('Media/Media', [
            'images' => $images, // Structure: ['directoryName' => ['file1', 'file2', ...]]
            'pageLabel' => 'Media Library',
        ]);
    }

    public function migrateImages()
    {
        // Step 1: Retrieve all products where image_url is not null
        $products = Product::whereNotNull('image_url')
            ->whereNull('attachment_id')
            ->get();

        DB::beginTransaction();

        try {

            // Step 2: Loop through each product
            foreach ($products as $product) {
                // Check if the image_url is valid and file exists
                if ($product->image_url && Storage::disk('public')->exists($product->image_url)) {
                    // Step 3: Store the image into the attachments table
                    // Here, we're assuming the image is already stored and its URL is available
                    $attachment = Attachment::create([
                        'path' => $product->image_url, // Assuming the image is already stored on public disk
                        'file_name' => $product->name, // Extract file name from URL
                        'attachment_type' => 'image', // Get MIME type
                        'size' => Storage::disk('public')->size($product->image_url), // Get file size
                        'type' => 'image', // Type of attachment
                    ]);

                    // Step 4: Update the product with the new attachment_id
                    $product->update([
                        'attachment_id' => $attachment->id, // Associate with the new attachment ID
                    ]);

                    // Optionally, you can log the migration status
                    // Log::info("Product ID {$product->id} updated with attachment ID {$attachment->id}");
                }
            }
            DB::commit();

            return 'Migration of product images completed successfully!';
        } catch (\Exception $e) {
            // If an error occurs, roll back the transaction
            DB::rollBack();

            // Optionally, log the error
            Log::error("Migration failed: " . $e->getMessage());

            // Return error response
            return $e->getMessage();
        }
    }
}
