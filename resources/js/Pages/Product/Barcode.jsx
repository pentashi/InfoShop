import * as React from "react";
import { useState, useEffect } from "react";
import Barcode from "react-barcode";
import { Head, usePage } from "@inertiajs/react";
import ejs from "ejs";

import { createRoot } from 'react-dom/client';
import { flushSync } from 'react-dom';
import JsBarcode from "jsbarcode";

export default function ProoductBarcode({
    product,
    barcode_settings,
    template,
}) {
    const shop_name = usePage().props.settings.shop_name;

    const parsedBarcodeSettings = barcode_settings.barcode_settings
        ? JSON.parse(barcode_settings.barcode_settings)
        : {};

    const [settings] = useState({
        containerHeight: parsedBarcodeSettings.container_height || "28mm",
        storeFontSize: parsedBarcodeSettings.store_font_size || "0.8em",
        priceFontSize: parsedBarcodeSettings.price_font_size || "0.8em",
        priceMarginTop: parsedBarcodeSettings.price_margin_top || "-3px",
        priceMarginBottom: parsedBarcodeSettings.price_margin_bottom || "-5px",
        barcodeMarginTop: parsedBarcodeSettings.barcode_margin_top || "-10px",
        barcodeHeight: parsedBarcodeSettings.barcode_height || 35,
        barcodeFontSize: parsedBarcodeSettings.barcode_font_size || 14,
        barcodeWidth: parsedBarcodeSettings.barcode_width || 1.5,
        barcodeFormat: parsedBarcodeSettings.barcode_format || "CODE128",
        productNameMarginTop:
            parsedBarcodeSettings.product_name_margin_top || "-4px",
        productNameFontSize:
            parsedBarcodeSettings.product_name_font_size || "0.7em",
    });

    const [content, setContent] = useState("");
    const [renderedTemplate, setRenderedTemplate] = useState("");

    function generateBarcode() {
      // Ensure that the barcode element is available before calling JsBarcode
      JsBarcode("#barcode", product.barcode, {
        format: settings.barcodeFormat,
        width: settings.barcodeWidth,
        height: settings.barcodeHeight,
        fontSize: settings.barcodeFontSize,
      });
    }


    useEffect(() => {
        const data = {
            product,
            settings,
            shop_name,
            barcode_settings,
        };
        // Render the EJS template with the fetched data
        const rendered = ejs.render(template, data);
        setRenderedTemplate(rendered);
    }, [template]);

    useEffect(() => {
        const timer = setTimeout(() => {
          generateBarcode(); // Call the barcode generation function
        }, 500);
    }, [renderedTemplate]);

    return (
        <>
            <Head title="Barcode" />
            <div dangerouslySetInnerHTML={{ __html: renderedTemplate }} />
            {/* <div
                style={{
                    textAlign: "center",
                    height: settings.containerHeight,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexDirection: "column",
                }}
            >
                {barcode_settings.show_barcode_store === "on" && (
                    <p
                        style={{
                            fontSize: settings.storeFontSize,
                            fontWeight: "bold",
                        }}
                    >
                        {shop_name}
                    </p>
                )}
                {barcode_settings.show_barcode_product_price === "on" && (
                    <p
                        style={{
                            fontSize: settings.priceFontSize,
                            fontWeight: "bold",
                            marginTop: settings.priceMarginTop,
                            marginBottom: settings.priceMarginBottom,
                        }}
                    >
                        RS. {product.price}
                    </p>
                )}
                <Barcode
                    style={{ marginTop: settings.barcodeMarginTop }}
                    value={product.barcode}
                    height={settings.barcodeHeight}
                    fontSize={settings.barcodeFontSize}
                    width={settings.barcodeWidth}
                    format={settings.barcodeFormat}
                />
                {barcode_settings.show_barcode_product_name === "on" && (
                    <p
                        style={{
                            marginTop: settings.productNameMarginTop,
                            fontSize: settings.productNameFontSize,
                        }}
                    >
                        {product.name}
                    </p>
                )}
            </div> */}
        </>
    );
}
