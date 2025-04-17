import React, { useState } from "react";
import { jsPDF } from "jspdf";

const Card = () => {
  const [fileCount, setFileCount] = useState(0);
  const [progress, setProgress] = useState(0);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFilesChange = (e) => {
    setFileCount(e.target.files.length);
  };

  const handleConvert = async () => {
    const imageFiles = document.getElementById("imageInput").files;

    if (imageFiles.length === 0) {
      alert("Pilih dulu gambarnya cokkk.");
      return;
    }

    setIsLoading(true);
    let doc = null;
    let count = 0;

    const startTime = Date.now();

    for (let i = 0; i < imageFiles.length; i++) {
      await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const img = new Image();
          img.src = e.target.result;
          img.onload = () => {
            const pxToMm = (px) => px / 3.779528;
            const imgWidthMm = pxToMm(img.width);
            const imgHeightMm = pxToMm(img.height);

            if (i === 0) {
              doc = new jsPDF({
                orientation: imgWidthMm > imgHeightMm ? "l" : "p",
                unit: "mm",
                format: [imgWidthMm, imgHeightMm],
              });
            } else {
              doc.addPage(
                [imgWidthMm, imgHeightMm],
                imgWidthMm > imgHeightMm ? "l" : "p"
              );
            }

            doc.addImage(
              img,
              "JPEG",
              0,
              0,
              imgWidthMm,
              imgHeightMm,
              undefined,
              "FAST"
            );

            count++;
            setProgress((count / imageFiles.length) * 100);
            resolve();
          };
        };
        reader.onerror = reject;
        reader.readAsDataURL(imageFiles[i]);
      });
    }

    const pdfBlob = doc.output("blob");
    const blobUrl = URL.createObjectURL(pdfBlob);

    const minDuration = 3000; // 3 detik
    const elapsed = Date.now() - startTime;
    const remaining = minDuration - elapsed;

    setTimeout(
      () => {
        setPdfUrl(blobUrl);
        setIsLoading(false);
      },
      remaining > 0 ? remaining : 0
    );
  };

  const reset = () => {
    document.getElementById("imageInput").value = "";
    setFileCount(0);
    setProgress(0);
    setPdfUrl(null);
    setIsLoading(false);
  };

  return (
    <>
      <div className="absolute z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-transparent border border-white p-6 rounded-lg shadow-md w-full max-w-md text-center">
        <h1 className="text-2xl font-bold text-gray-100 mb-1 mt-3">
          Gambar to PDF
        </h1>
        <p className="text-gray-200 mb-3">
          Ubah beberapa gambar Anda menjadi satu PDF
        </p>

        <div className="border-2 border-dashed border-gray-300 p-4 rounded-lg bg-transparent cursor-pointer mb-4">
          <label
            htmlFor="imageInput"
            className="cursor-pointer flex flex-col items-center text-blue-500"
          >
            <img
              src="https://img.icons8.com/ios/50/ffffff/image.png"
              alt="Upload"
              className="w-12 mb-2"
            />
            <span>Pilih Gambar</span>
          </label>
          <input
            id="imageInput"
            type="file"
            accept="image/*"
            multiple
            onChange={handleFilesChange}
            className="hidden"
          />
        </div>

        {fileCount > 0 ? (
          <p className="text-sm text-gray-400 mb-2">
            ({fileCount}) gambar dipilih.
          </p>
        ) : (
          <p className="text-sm text-gray-400 mb-2">
            Tidak ada gambar yang dipilih!
          </p>
        )}

        {/* Loading Bar Animation */}
        {isLoading && (
          <div className="relative w-full max-w-md mx-auto h-2 mb-2 overflow-hidden rounded bg-gray-200">
            <div className="h-full bg-blue-500 animate-loading-bar origin-left" />
          </div>
        )}

        {!pdfUrl ? (
          <button
            onClick={handleConvert}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
            disabled={isLoading}
          >
            Ubah ke PDF
          </button>
        ) : (
          <>
            <a
              href={pdfUrl}
              download="converted.pdf"
              className="block bg-blue-800 text-white py-2 rounded hover:bg-blue-600 mt-4"
            >
              Download PDF
            </a>
            <button
              onClick={reset}
              className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700 mt-2"
            >
              Refresh
            </button>
          </>
        )}

        {/* Optional progress bar */}
        {progress > 0 && progress < 100 && (
          <div className="w-full bg-gray-200 rounded-full h-3 mt-4">
            <div
              className="bg-blue-600 h-3 rounded-full transition-all"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        )}
      </div>
      {/* Footer */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-center text-sm text-gray-400">
        Created by{" "}
        <a
          href="https://haisyam.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-indigo-400 hover:text-indigo-300"
        >
          haisyam.com
        </a>
      </div>
    </>
  );
};

export default Card;
