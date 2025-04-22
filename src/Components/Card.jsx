import React, { useState } from "react";
import { jsPDF } from "jspdf";

const Card = () => {
  const [fileCount, setFileCount] = useState(0);
  const [progress, setProgress] = useState(0);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [fileName, setFileName] = useState("isi nama file luu"); // State untuk nama file

  const handleFilesChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(files);
    setFileCount(files.length);
  };

  const handleFileNameChange = (e) => {
    setFileName(e.target.value);
  };

  const handleConvert = async () => {
    if (selectedFiles.length === 0) {
      alert("Pilih dulu gambarnya cokkk.");
      return;
    }

    if (!fileName.trim()) {
      alert("Kasih nama dulu untuk file PDF-nya cokkk.");
      return;
    }

    setIsLoading(true);
    let doc = null;
    let count = 0;

    const startTime = Date.now();

    for (let i = 0; i < selectedFiles.length; i++) {
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
            setProgress((count / selectedFiles.length) * 100);
            resolve();
          };
        };
        reader.onerror = reject;
        reader.readAsDataURL(selectedFiles[i]);
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
    setSelectedFiles([]);
    setFileCount(0);
    setProgress(0);
    setPdfUrl(null);
    setIsLoading(false);
    setFileName("converted"); // Reset nama file ke default
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

        {/* Form input untuk nama file - muncul hanya ketika ada gambar yang dipilih */}
        {fileCount > 0 && (
          <div className="mb-4">
            <label
              htmlFor="fileName"
              className="block text-gray-300 text-sm mb-1"
            >
              Nama File Hasil:
            </label>
            <input
              id="fileName"
              type="text"
              value={fileName}
              onChange={handleFileNameChange}
              placeholder="Masukkan nama file"
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-400 mt-1">
              File akan disimpan sebagai: {fileName}.pdf
            </p>
          </div>
        )}

        {/* Loading Bar Animation */}
        {isLoading && (
          <div className="relative w-full max-w-md mx-auto h-2 mb-2 overflow-hidden rounded bg-gray-200">
            <div className="h-full bg-blue-500 animate-loading-bar origin-left" />
          </div>
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
              download={`${fileName}.pdf`} // Gunakan nama file yang diinput user
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
