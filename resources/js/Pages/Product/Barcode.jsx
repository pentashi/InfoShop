import * as React from "react";
import Barcode from "react-barcode";
import { Head,usePage } from "@inertiajs/react";

export default function ProoductBarcode({ product }) {
    const shop_name = usePage().props.settings.shop_name;

    return (
        <>
            <Head title="Barcode" />
            <div style={{textAlign:'center', maxWidth:'250px', display:"flex", alignItems:'center', flexDirection:'column'}}>
                <p style={{fontSize:'18px', fontWeight:'bold', }}>{shop_name}</p>
                <p style={{fontSize:'23px', fontWeight:'bold', marginTop:'-5px', marginBottom:'-5px'}}>RS. {product.price}</p>
                <Barcode style={{marginTop:'-10px'}} value={product.barcode} height={40} width={2}/>
                <p style={{marginTop:'-5px'}}>{product.name}</p>
            </div>
        </>
    );
}