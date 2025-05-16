import SellerFormSelector from "./_components/seller-form-selector.client";

const SellerPage = () => {
  const logoUrl = process.env.LOGO_URL;

  return <SellerFormSelector logoUrl={logoUrl} />;
};

export default SellerPage;
