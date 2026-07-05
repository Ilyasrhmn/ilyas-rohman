import { useEffect } from "react";
import { useLenis } from "@/components/layout/smooth-scroll";

export function useLenisModal(open: boolean) {
    const lenis = useLenis();

    useEffect(() => {
        if (open) {
            lenis?.stop();
        } else {
            lenis?.start();
        }
    }, [open, lenis]);
}
