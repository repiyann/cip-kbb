import { Loader2 } from "lucide-react"

export default function LoadingSpinner() {
    return (
        <div className="flex items-center justify-center py-8">
            <Loader2 className="text-primary h-8 w-8 animate-spin" />
        </div>
    );
}
