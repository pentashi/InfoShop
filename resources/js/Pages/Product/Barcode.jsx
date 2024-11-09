import * as React from "react";
import Barcode from "react-barcode";
import { Head,usePage } from "@inertiajs/react";

export default function ProoductBarcode({ product, barcode_settings }) {
    const shop_name = usePage().props.settings.shop_name;

    return (
        <>
            <Head title="Barcode" />
            <div style={{textAlign:'center', width:'38mm', maxWidth:'38mm', height:'25mm', display:"flex", alignItems:'center', flexDirection:'column'}}>
            {barcode_settings.show_barcode_store === 'on' && (
                    <p style={{ fontSize: '0.8em', fontWeight: 'bold' }}>{shop_name}</p>
                )}
                {barcode_settings.show_barcode_product_price === 'on' && (
                    <p style={{ fontSize: '0.8em', fontWeight: 'bold', marginTop: '-3px', marginBottom: '-5px' }}>
                        RS. {product.price}
                    </p>
                )}
                <Barcode style={{ marginTop: '-10px' }} value={product.barcode} height={40} width={1.5} format={"CODE128"} />
                {barcode_settings.show_barcode_product_name === 'on' && (
                    <p style={{ marginTop: '-3px', fontSize: '0.7em' }}>{product.name}</p>
                )}
            </div>
        </>
    );
}