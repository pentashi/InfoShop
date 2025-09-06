import React from 'react';
import { Button, IconButton } from '@mui/material';
import { Barcode, History, Star } from 'lucide-react';
import { Link, router } from '@inertiajs/react';

const ProductsList = ({ products, handleProductEdit }) => {
    return (
        <ul className='faded-bottom no-scrollbar grid gap-2 overflow-auto pt-1 pb-1 w-full'>
            {products.map((product) => (
                <li class="p-3 w-full shadow-sm">
                    <div class="flex justify-between items-center">
                        <div class="uppercase tracking-wide text-xs text-blue-900 font-semibold">
                            <Link
                                href={"/products/" + product.id + "/edit"}
                            >
                                {product.name}
                            </Link>
                        </div>
                        <div className='flex ml-2'>
                            <IconButton>
                                <Star size={16} />
                            </IconButton>
                            <IconButton onClick={()=>router.visit(`/quantity/${product.stock_id}/log`)}>
                                <History size={16} />
                            </IconButton>
                        </div>
                    </div>
                    <div class="mt-2 grid grid-cols-3 gap-4">
                        <div onClick={() => handleProductEdit(product, 'batch')}>
                            <div class="text-gray-500 text-xs">Sale Price</div>
                            <div class="text-gray-700 text-xs font-bold">Rs. {product.price}</div>
                        </div>
                        <div onClick={() => handleProductEdit(product, 'batch')}>
                            <div class="text-gray-500 text-xs">Cost</div>
                            <div class="text-gray-700 text-xs font-bold">Rs {product.cost}</div>
                        </div>
                        <div onClick={() => handleProductEdit(product, 'qty')}>
                            <div class="text-gray-500 text-xs">In Stock</div>
                            <div class="text-gray-700 text-xs font-bold">{product.quantity}</div>
                        </div>
                    </div>
                </li>
            ))}
        </ul>

    );
};

export default ProductsList;
