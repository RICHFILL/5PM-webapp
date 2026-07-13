import { useRef, useState, useEffect, useCallback } from "react";
import { Eraser, Upload, Type } from "lucide-react";

const TABS = [
  { key: "draw", label: "Draw", icon: Type },
  { key: "type", label: "Type Full Name", icon: Type },
  { key: "upload", label: "Upload Image", icon: Upload },
];

export default function SignaturePad({ fullName, onChange }) {
  const [mode, setMode] = useState("draw");
  const canvasRef = useRef(null);
  const drawing = useRef(false);
  const hasDrawn = useRef(false);
  const [typedName, setTypedName] = useState(fullName || "");
  const [uploadPreview, setUploadPreview] = useState(null);

  const getCanvasCtx = () => canvasRef.current?.getContext("2d");

  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ratio = window.devicePixelRatio || 1;
    const { width, height } = canvas.getBoundingClientRect();
    canvas.width = width * ratio;
    canvas.height = height * ratio;
    const ctx = getCanvasCtx();
    ctx.scale(ratio, ratio);
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.strokeStyle = "#111827";
  }, []);

  useEffect(() => {
    if (mode === "draw") {
      resizeCanvas();
    }
  }, [mode, resizeCanvas]);

  const getPos = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const point = e.touches ? e.touches[0] : e;
    return { x: point.clientX - rect.left, y: point.clientY - rect.top };
  };

  const startDraw = (e) => {
    e.preventDefault();
    drawing.current = true;
    hasDrawn.current = true;
    const { x, y } = getPos(e);
    const ctx = getCanvasCtx();
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e) => {
    if (!drawing.current) return;
    e.preventDefault();
    const { x, y } = getPos(e);
    const ctx = getCanvasCtx();
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const endDraw = () => {
    if (!drawing.current) return;
    drawing.current = false;
    emitDrawSignature();
  };

  const emitDrawSignature = () => {
    if (!hasDrawn.current) return onChange(null);
    const canvas = canvasRef.current;
    onChange({ type: "drawn", data: canvas.toDataURL("image/png") });
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = getCanvasCtx();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    hasDrawn.current = false;
    onChange(null);
  };

  const handleUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setUploadPreview(reader.result);
      onChange({ type: "uploaded", data: reader.result });
    };
    reader.readAsDataURL(file);
  };

  const handleTypedChange = (val) => {
    setTypedName(val);
    onChange(val.trim() ? { type: "typed", data: val.trim() } : null);
  };

  const switchMode = (key) => {
    setMode(key);
    onChange(null);
    if (key === "type") handleTypedChange(typedName || fullName || "");
  };

  return (
    <div className="space-y-3">
      <div className="flex gap-2 border-b border-gray-200">
        {TABS.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => switchMode(t.key)}
            className={`px-3 py-2 text-sm font-medium border-b-2 transition-colors ${
              mode === t.key
                ? "border-neon-tangerine text-neon-tangerine"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {mode === "draw" && (
        <div className="space-y-2">
          <canvas
            ref={canvasRef}
            className="w-full h-40 rounded-lg border border-gray-200 bg-white touch-none cursor-crosshair"
            onMouseDown={startDraw}
            onMouseMove={draw}
            onMouseUp={endDraw}
            onMouseLeave={endDraw}
            onTouchStart={startDraw}
            onTouchMove={draw}
            onTouchEnd={endDraw}
          />
          <button
            type="button"
            onClick={clearCanvas}
            className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-red-600"
          >
            <Eraser size={14} /> Clear
          </button>
        </div>
      )}

      {mode === "type" && (
        <div className="space-y-2">
          <input
            type="text"
            value={typedName}
            onChange={(e) => handleTypedChange(e.target.value)}
            placeholder="Type your full name"
            className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:border-neon-tangerine focus:ring-2 focus:ring-neon-tangerine/30 outline-none"
          />
          {typedName.trim() && (
            <div className="rounded-lg border border-gray-200 bg-slate-50 px-4 py-6 text-center">
              <span
                className="text-3xl text-gray-900"
                style={{ fontFamily: "'Brush Script MT', cursive" }}
              >
                {typedName}
              </span>
            </div>
          )}
        </div>
      )}

      {mode === "upload" && (
        <div className="space-y-2">
          <input
            type="file"
            accept="image/*"
            onChange={handleUpload}
            className="block w-full text-sm text-gray-600 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-neon-tangerine/10 file:text-neon-tangerine file:text-sm file:font-medium hover:file:bg-neon-tangerine/20"
          />
          {uploadPreview && (
            <div className="rounded-lg border border-gray-200 bg-white p-3">
              <img
                src={uploadPreview}
                alt="signature preview"
                className="max-h-32 mx-auto object-contain"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
