/* eslint-disable jsx-a11y/alt-text */
// app/components/pdf/ProductDetailPdf.tsx
"use client";

import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";
import { Car } from "@/dynamo-db/cars.db";
import { formatCurrency } from "@/utils/currencyUtils";

interface Props {
  car: Car;
  imageBase64?: string;
  logoUrl?: string;
}

const styles = StyleSheet.create({
  page: {
    paddingHorizontal: 32,
    paddingVertical: 16,
    fontSize: 11,
    fontFamily: "Helvetica",
    backgroundColor: "#FFFFFF",
  },
  card: {
    padding: 20,
    backgroundColor: "#fafafa",
    borderRadius: 8,
    marginBottom: 5,
  },
  logoContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 22,
    marginTop: 16,
  },
  logo: {
    width: 150,
    height: 60,
    objectFit: "contain",
  },
  title: {
    fontSize: 16,
    fontWeight: 700,
    color: "#111827",
    textAlign: "left",
  },
  image: {
    // width: 200,
    height: 300,
    objectFit: "cover",
    width: "auto",
    borderRadius: 6,
    marginBottom: 16,
  },
  grid: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 5,
  },
  specBox: {
    width: "47%",
    marginBottom: 5,
  },
  label: {
    fontSize: 10,
    color: "#6B7280",
    marginBottom: 2,
  },
  value: {
    fontSize: 12,
    fontWeight: 700,
    color: "#111827",
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: 600,
    marginTop: 16,
    marginBottom: 6,
    color: "#374151",
  },
  description: {
    fontSize: 10,
    lineHeight: 1.4,
    color: "#374151",
  },
  carIcon: {
    width: 22,
    height: 22,
    marginRight: 6,
    transform: "scaleX(-1)",
  },
});

const carIcon =
  "https://public-images-carbucloud.s3.us-east-2.amazonaws.com/home/blue-car.png";

export function ProductDetailPdf({ car, imageBase64, logoUrl }: Props) {
  const date = new Date();
  const formatted = date.toLocaleDateString("es-ES", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const isMotorbike = car.vehicleType === "motorbike";

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={{ position: "absolute", top: 0, right: 0, padding: 16 }}>
          <Text
            style={{
              fontSize: 9,
              color: "#6B7280",
              textAlign: "center",
              marginTop: 3,
              marginBottom: 6,
            }}
          >
            {formatted.charAt(0).toUpperCase() + formatted.slice(1)}
          </Text>
        </View>
        {logoUrl && (
          <View style={styles.logoContainer}>
            <Image src={logoUrl} style={styles.logo} />
          </View>
        )}

        <View style={styles.card}>
          <View style={{ paddingLeft: isMotorbike ? 0 : 30, opacity: 0.7 }}>
            <Text style={{ fontSize: 9, color: "gray" }}>
              {car.year} - {Number(car.km).toLocaleString("es")}km
            </Text>
          </View>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 16,
            }}
          >
            {/* en algun lado hay que poner el icono de la moto */}
            {car.vehicleType !== "motorbike" && (
              <Image src={carIcon} style={styles.carIcon} />
            )}
            <Text style={styles.title}>
              {car.brand} {car.model}
            </Text>
          </View>
          <Image src={imageBase64} style={styles.image} />

          <View style={styles.grid}>
            <View style={styles.specBox}>
              <Text style={styles.label}>Marca</Text>
              <Text style={styles.value}>{car.brand}</Text>
            </View>
            <View style={styles.specBox}>
              <Text style={styles.label}>Modelo</Text>
              <Text style={styles.value}>{car.model}</Text>
            </View>
            <View style={styles.specBox}>
              <Text style={styles.label}>Año</Text>
              <Text style={styles.value}>{car.year}</Text>
            </View>
            <View style={styles.specBox}>
              <Text style={styles.label}>
                {car.vehicleType !== "motorbike" ? "Motor" : "Cilindrada"}
              </Text>
              <Text style={styles.value}>
                {car.vehicleType !== "motorbike"
                  ? car.engine
                  : car.displacement}
              </Text>
            </View>
            <View style={styles.specBox}>
              <Text style={styles.label}>Transmisión</Text>
              <Text style={styles.value}>{car.transmission}</Text>
            </View>
            {car.vehicleType !== "motorbike" && (
              <View style={styles.specBox}>
                <Text style={styles.label}>Tracción</Text>
                <Text style={styles.value}>{car.traction}</Text>
              </View>
            )}
            <View style={styles.specBox}>
              <Text style={styles.label}>Tipo</Text>
              <Text style={styles.value}>{car.carType}</Text>
            </View>
            <View style={styles.specBox}>
              <Text style={styles.label}>Precio</Text>
              <Text style={{ ...styles.value, color: "#3c81f6" }}>
                {formatCurrency(car.price, car.currency)}
              </Text>
            </View>
            <View style={styles.specBox}>
              <Text style={styles.label}>Kilometraje</Text>
              <Text style={styles.value}>
                {Number(car.km).toLocaleString("es")} km
              </Text>
            </View>
          </View>
          <View
            style={{
              height: 1,
              width: "100%",
              backgroundColor: "#e8e8e8",
              marginTop: 16,
            }}
          />
          <Text style={styles.sectionTitle}>Descripción</Text>
          <Text style={styles.description}>
            {car.description || "Sin especificar"}
          </Text>
        </View>
        <View>
          <Text
            style={{
              fontSize: 8,
              color: "#6B7280",
              textAlign: "center",
              marginTop: 16,
              marginBottom: 0,
            }}
          >
            *Este documento es solo informativo y no constituye una oferta
            vinculante.
          </Text>
        </View>
      </Page>
    </Document>
  );
}
