import React from "react";
// Core viewer
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import { Viewer, Worker } from "@react-pdf-viewer/core";
// import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import { toolbarPlugin } from "@react-pdf-viewer/toolbar";
//export { ToolbarSlot, TransformToolbarSlot } from "@react-pdf-viewer/toolbar";

const PdfViewer = ({ url }) => {
    
    // const defaultLayoutPluginInstance = defaultLayoutPlugin({
    //     sidebarTabs: (defaultTabs) => [],
    // });
    const toolbarPluginInstance = toolbarPlugin();
    const { renderDefaultToolbar, Toolbar } = toolbarPluginInstance;

    const transform = (slot) => ({
        ...slot,
        Download: () => <></>,
        DownloadMenuItem: () => <></>,
        SwitchTheme: () => <></>,
        SwitchThemeMenuItem: () => <></>,
        Print: () => <></>,
        PrintMenuItem: () => <></>,

        Open: () => <></>,
        OpenMenuItem: () => <></>,

        ShowSearchPopover: () => <></>,
        ShowPropertiesMenuItem: () => <></>,

        EnterFullScreen: () => <></>,
    });

    console.log(url);
    return (
        <>
            <div
                className="rpv-core__viewer"
                style={{
                    border: "1px solid rgba(0, 0, 0, 0.3)",
                    display: "flex",
                    flexDirection: "column",
                    height: "100%",
                }}
            >
                <div
                    style={{
                        alignItems: "center",
                        backgroundColor: "#eeeeee",
                        borderBottom: "1px solid rgba(0, 0, 0, 0.1)",
                        display: "flex",
                        padding: "0.25rem",
                    }}
                >
                    <Toolbar>{renderDefaultToolbar(transform)}</Toolbar>
                </div>
                <div
                    style={{
                        flex: 1,
                        overflow: "hidden",
                    }}
                >
                    <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.3.122/build/pdf.worker.js">
                        <Viewer fileUrl={url} plugins={[toolbarPluginInstance]} />
                    </Worker>
                </div>
            </div>
        </>
    );
};

export default PdfViewer;
