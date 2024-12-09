<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Storage;
use ZipArchive;

class UpgradeController extends Controller
{
    public function showUploadForm()
    {
        return view('upload');
    }

    public function handleUpload(Request $request)
    {
        // Validate the uploaded file
        $request->validate([
            'zip_file' => 'required|file|mimes:zip',
        ]);

        // Handle the uploaded ZIP file
        $zipFile = $request->file('zip_file');
        $temporaryPath = storage_path('app/tmp_zip');
        $extractPath = $temporaryPath . '/extracted';

        // Create the temporary directories for extraction
        if (!File::exists($temporaryPath)) {
            File::makeDirectory($temporaryPath, 0755, true);
        }

        // Move the uploaded ZIP file to the temporary location
        $zipFilePath = $temporaryPath . '/uploaded.zip';
        $zipFile->move($temporaryPath, 'uploaded.zip');

        // Initialize ZIP extraction
        $zip = new ZipArchive;
        if ($zip->open($zipFilePath) === true) {
            // Extract the contents to a temporary directory
            $zip->extractTo($extractPath);
            $zip->close();

            // Define the root folders that can be replaced (without removing the folders themselves)
            $rootFolders = ['app', 'routes', 'resources', 'config'];
            foreach ($rootFolders as $folder) {
                $source = $extractPath . '/' . $folder;
                $destination = base_path($folder);

                // If the source folder exists, extract the contents directly into the destination folder
                if (File::exists($source)) {
                    // Extract and overwrite the files automatically when extracting
                    File::copyDirectory($source, $destination);
                }
            }

            // Handle the build folder within the public directory (replace only if build exists in the ZIP)
            $existingBuildPath = public_path('build');
            $newBuildPath = $extractPath . '/build';
            
            // Check if the 'build' folder exists in the ZIP file
            if (File::exists($newBuildPath)) {
                // Delete the existing build folder before replacing it
                if (File::exists($existingBuildPath)) {
                    File::deleteDirectory($existingBuildPath);
                }

                // Now copy the new build folder contents
                File::copyDirectory($newBuildPath, $existingBuildPath);
            }

            // Clean up temporary files
            File::deleteDirectory($temporaryPath);

            return redirect()->back()->with('success', 'Application upgrade applied successfully.');
        }

        return redirect()->back()->with('error', 'Failed to extract the ZIP file.');
    }
}
