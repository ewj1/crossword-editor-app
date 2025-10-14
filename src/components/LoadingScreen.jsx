import { Loader2 } from "lucide-react";

export default function LoadingScreen({ children = "Loading..." }) {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-gray-50">
      <div className="flex flex-col items-center space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-gray-600" />
        <p className="text-sm text-gray-600">{children}</p>
      </div>
    </div>
  );
}
