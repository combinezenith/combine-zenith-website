import CTASectionEnhanced from "@/app/(components)/CTASection";
import ContactDetails from "@/app/(components)/ContactDetails";
import ContactForm from "@/app/(components)/ContactForm";
import React from "react";

const Contact = () => {
  return (
<div className="">
    <ContactForm/>
  <ContactDetails/>

  <CTASectionEnhanced/>

</div>
  );
};

export default Contact;
