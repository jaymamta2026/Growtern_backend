export const getEmailContent = ({
  emailType,
}) => {
  switch (emailType) {

    case "apply-now":
      return {
        title: "Application Received",
        content:
          "Thank you for applying for our program. Our admissions team will review your application and contact you shortly.",
      };

    case "demo-class":
      return {
        title: "Demo Class Request Received",
        content:
          "Thank you for requesting a demo class. Our team will contact you shortly with the schedule details.",
      };

    case "download-syllabus":
      return {
        title: "Syllabus Request Received",
        content:
          "Thank you for your interest. We have attached our company profile for your reference.",
      };

    case "career":
      return {
        title: "Application Received",
        content:
          "Thank you for applying for a career opportunity with Growtern. Our HR team will review your application.",
      };

    case "hire-from-us":
      return {
        title: "Hiring Request Received",
        content:
          "Thank you for your interest in hiring our students. Our placement team will contact you soon.",
      };

    case "contact-us":
      return {
        title: "Message Received",
        content:
          "Thank you for contacting Growtern Academy. Our team will get back to you shortly.",
      };

    case "workshop":
      return {
        title: "Workshop Request Received",
        content:
          "Thank you for your interest in our workshop. Our team will contact you with further details.",
      };

    case "referral":
      return {
        title: "Referral Submitted",
        content:
          "Thank you for referring a candidate to Growtern Academy.",
      };

    default:
      return {
        title: "Thank You",
        content:
          "Thank you for contacting Growtern Academy.",
      };
  }
};