import * as React from "react";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid2";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router } from "@inertiajs/react";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import Editor from "@monaco-editor/react"; // Import Prism CSS for syntax highlighting
import ejs from "ejs";
import axios from "axios";
import dayjs from "dayjs";

export default function QuoteTemplate({
    template,
    sale,
    salesItems,
    settings,
    user_name,
}) {
    const [code, setCode] = useState(template);
    const [renderedTemplate, setRenderedTemplate] = useState("");

    useEffect(() => {
        const fetchTemplateAndRender = async () => {
            try {
                const data = {
                    sale,
                    salesItems,
                    settings,
                    user_name,
                };

                // Render the EJS template with the fetched data
                const rendered = ejs.render(code, data);
                setRenderedTemplate(rendered); // Store rendered HTML
            } catch (error) {
                console.error("Error rendering template:", error);
            }
        };

        fetchTemplateAndRender();
    }, [code]);

    function handleEditorChange(value, event) {
        setCode(value);
    }

    const saveTemplate = (event) => {
        event.preventDefault();

        axios
            .post("/settings/save-quote-template", { template: code })
            .then((response) => {
                // Handle success
                Swal.fire(
                    "Success",
                    "Template updated successfully!",
                    "success"
                );
            })
            .catch((error) => {
                // Handle error
                console.error("Error saving template:", error);
                Swal.fire("Error", "Failed to update template!", "error");
            });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Settings" />
            <Grid container justifyContent="flex-end" sx={{ mt: 1, mb: 1 }}>
                <Button
                    variant="contained"
                    type="button"
                    color="primary"
                    onClick={(event) => saveTemplate(event)}
                >
                    Save Template
                </Button>
            </Grid>

            <Grid container spacing={2}>
                <Grid size={12}>
                    <Editor
                        height="85vh"
                        language="html"
                        theme="vs-dark"
                        value={code}
                        onChange={handleEditorChange}
                        options={{
                            inlineSuggest: true,
                            fontSize: "16px",
                            formatOnType: false,
                            autoClosingBrackets: true,
                            minimap: { scale: 10 },
                        }}
                    />
                </Grid>
                <Grid size={12} sx={{ overflowY: "scroll" }}>
                    <div
                        className="quote-preview"
                        dangerouslySetInnerHTML={{ __html: renderedTemplate }}
                    />
                </Grid>
            </Grid>
        </AuthenticatedLayout>
    );
}
