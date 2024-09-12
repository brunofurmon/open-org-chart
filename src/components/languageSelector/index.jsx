import { useTranslation } from "@/presentation/i18n/client";
import { useCallback } from "react";

const LanguageSelector = () => {
  const { i18n } = useTranslation("orgchart");

  const setLanguage = useCallback((lng) => i18n.changeLanguage(lng), [i18n]);

  return (
    <>
      <button onClick={() => setLanguage("en")}>EN</button>
      <button onClick={() => setLanguage("pt")}>PT</button>
    </>
  );
};

export default LanguageSelector;
