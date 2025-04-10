"use client"

import { useEffect, useRef } from "react"

export default function MapLocation() {
  const mapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // This would normally load the Google Maps API and initialize the map
    // For this example, we'll just create a placeholder
    if (mapRef.current) {
      const iframe = document.createElement("iframe")
      iframe.src =
        "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3284.0168878895436!2d-58.38375908495731!3d-34.60373446500708!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4aa9f0a6da5edb%3A0x11bead4e234e558b!2sObelisco!5e0!3m2!1sen!2sar!4v1649287661684!5m2!1sen!2sar"
      iframe.width = "100%"
      iframe.height = "400"
      iframe.style.border = "0"
      iframe.allowFullscreen = true
      iframe.loading = "lazy"
      iframe.referrerPolicy = "no-referrer-when-downgrade"

      mapRef.current.appendChild(iframe)
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.innerHTML = ""
      }
    }
  }, [])

  return <div ref={mapRef} className="h-[400px] rounded-lg overflow-hidden shadow-md"></div>
}

