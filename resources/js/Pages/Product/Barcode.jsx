import * as React from "react";
import Barcode from "react-barcode";
import { Head,usePage } from "@inertiajs/react";

export default function ProoductBarcode({ product }) {
    const shop_name = usePage().props.settings.shop_name;

    return (
        <>
            <Head title="Barcode" />
            <div style={{textAlign:'center', maxWidth:'200px'}}>
                <strong>{shop_name}</strong>
                <Barcode value={product.barcode} height={50} width={2}/>
                <p>{product.name}</p>
                <p>{product.price}</p>
            </div>
        </>
    );
}