import * as React from "react";
import { useState } from "react";
import Barcode from "react-barcode";
import { Head, usePage } from "@inertiajs/react";

export default function ProoductBarcode({ product, barcode_settings }) {
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
            productNameMarginTop: parsedBarcodeSettings.product_name_margin_top || "-4px",
            productNameFontSize: parsedBarcodeSettings.product_name_font_size || "0.7em",
        });

    return (
        <>
            <Head title="Barcode" />
            <div
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
          <p style={{ fontSize: settings.storeFontSize, fontWeight: "bold" }}>
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
      </div>
        </>
    );
}
