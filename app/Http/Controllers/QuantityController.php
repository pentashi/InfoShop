<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\QuantityAdjustment;
use App\Models\ProductStock;

use Illuminate\Support\Facades\DB;

class QuantityController extends Controller
{
    public function store(Request $request)
    {
        // Validate the incoming request data
        $validated = $request->validate([
            'batch_id' => 'required',
            'stock_id' => 'nullable|integer',  // Can be null to create a new ProductStock
            'quantity' => 'required',
            'reason' => 'required|string',
            'store_id' => 'required|integer',
        ]);

        // Start database transaction to ensure atomicity
        DB::beginTransaction();

        try {
            // Retrieve the stock if stock_id is provided
            if ($validated['stock_id']) {
                $productStock = ProductStock::find($validated['stock_id']);

                // If stock doesn't exist, return error
                if (!$productStock) {
                    return response()->json(['error' => 'Product stock not found.'], 404);
                }

                // Save the previous quantity before adjustment
                $previousQuantity = $productStock->quantity;

                // Update the stock quantity by adding the new quantity
                $productStock->quantity += $validated['quantity'];
                $productStock->save();

            } else {
                // If stock_id is null, create a new ProductStock record
                $productStock = ProductStock::create([
                    'store_id' => $validated['store_id'],
                    'batch_id' => $validated['batch_id'],
                    'quantity' => $validated['quantity'],
                ]);

                // Since this is a new record, previous quantity will be 0
                $previousQuantity = 0;
            }

            // Create a new QuantityAdjustment record
            $quantityAdjustment = new QuantityAdjustment([
                'batch_id' => $validated['batch_id'],
                'stock_id'=>$productStock->id,
                'previous_quantity' => $previousQuantity,
                'adjusted_quantity' => $validated['quantity'],
                'reason' => $validated['reason'],
                'created_by' => auth()->id(), // Assuming the user is authenticated
            ]);

            $quantityAdjustment->save();

            // Commit transaction
            DB::commit();

            // Return success response
            return response()->json(['message' => 'Quantity adjustment and stock update successful.'], 200);

        } catch (\Exception $e) {
            // Rollback transaction in case of error
            DB::rollBack();

            // Return error response
            return response()->json(['error' => $e], 500);
        }
    }

}
