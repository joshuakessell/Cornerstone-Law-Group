import { IntakeDef, FieldDef } from "../engine/types";

const childFields = (index: number): FieldDef[] => [
  { id: `child${index}Name`, label: `Child ${index} full legal name`, type: "text" },
  {
    id: `child${index}Sex`,
    label: `Child ${index} sex`,
    type: "select",
    options: [
      { label: "M", value: "M" },
      { label: "F", value: "F" },
    ],
  },
  { id: `child${index}Dob`, label: `Child ${index} date of birth`, type: "date" },
  { id: `child${index}PlaceOfBirth`, label: `Child ${index} place of birth`, type: "text" },
  { id: `child${index}Ssn`, label: `Child ${index} SSN`, type: "text" },
  { id: `child${index}CityCountyState`, label: `Child ${index} city/county/state of birth`, type: "text" },
];

const guardianFields = (index: number): FieldDef[] => [
  { id: `guardian${index}Name`, label: `Guardian ${index} full legal name`, type: "text" },
  {
    id: `guardian${index}Sex`,
    label: `Guardian ${index} sex`,
    type: "select",
    options: [
      { label: "M", value: "M" },
      { label: "F", value: "F" },
    ],
  },
];

const executorFields = (index: number): FieldDef[] => [
  { id: `executor${index}Name`, label: `Executor ${index} full legal name`, type: "text" },
  {
    id: `executor${index}Sex`,
    label: `Executor ${index} sex`,
    type: "select",
    options: [
      { label: "M", value: "M" },
      { label: "F", value: "F" },
    ],
  },
];

const beneficiaryFields = (index: number): FieldDef[] => [
  { id: `beneficiary${index}Name`, label: `Beneficiary ${index} full legal name`, type: "text" },
  {
    id: `beneficiary${index}Sex`,
    label: `Beneficiary ${index} sex`,
    type: "select",
    options: [
      { label: "M", value: "M" },
      { label: "F", value: "F" },
    ],
  },
];

export const willsTrustsEstatesIntake: IntakeDef = {
  intakeType: "wills-trusts-estates",
  title: "Client Intake: Wills, Trusts & Estates",
  description: "Information for wills, trusts, and estate planning.",
  steps: [
    {
      id: "your-info",
      title: "Your Information",
      fields: [
        { id: "yourFirstName", label: "First name", type: "text", required: true },
        { id: "yourMiddleName", label: "Middle name", type: "text" },
        { id: "yourLastName", label: "Last name", type: "text", required: true },
        { id: "yourBirthName", label: "Birth/Maiden name", type: "text" },
        { id: "yourStreet", label: "Street address", type: "text" },
        { id: "yourCity", label: "City", type: "text" },
        { id: "yourState", label: "State", type: "text" },
        { id: "yourZip", label: "Zip code", type: "text" },
        { id: "yourCounty", label: "County", type: "text" },
        { id: "yourCountyDuration", label: "How long in this county?", type: "text" },
        { id: "yourHomePhone", label: "Home phone", type: "tel" },
        { id: "yourCellPhone", label: "Cell phone", type: "tel" },
        { id: "yourDob", label: "Date of birth", type: "date" },
        { id: "yourPlaceOfBirth", label: "Place of birth", type: "text" },
        { id: "yourSsn", label: "SSN", type: "text" },
        { id: "yourDriversLicense", label: "Driver's license number", type: "text" },
        { id: "yourDriversLicenseState", label: "Issuing state", type: "text" },
        { id: "yourAutoMake", label: "Current automobile make", type: "text" },
        { id: "yourAutoModel", label: "Current automobile model", type: "text" },
        { id: "yourAutoColor", label: "Current automobile color", type: "text" },
        { id: "yourAutoYear", label: "Current automobile year", type: "text" },
        { id: "yourEmployerName", label: "Employer name", type: "text" },
        { id: "yourEmployerAddress", label: "Employer address", type: "text" },
        { id: "yourOccupation", label: "Occupation", type: "text" },
        { id: "yourAnnualIncome", label: "Approximate annual income", type: "text" },
        { id: "yourWorkPhone", label: "Work phone", type: "tel" },
        { id: "yourSafeEmail", label: "Secure/safe email address", type: "email" },
        {
          id: "yourInvoiceEmailOk",
          label: "Email monthly invoices/billing statements as PDF instead of mail?",
          type: "radio",
          options: [
            { label: "Yes", value: "yes" },
            { label: "No", value: "no" },
          ],
        },
        { id: "yourPreferredMailing", label: "Preferred mailing address", type: "text" },
        { id: "yourBillingAddress", label: "Billing address (if different)", type: "text" },
      ],
    },
    {
      id: "spouse-info",
      title: "Spouse Information",
      fields: [
        { id: "spouseFirstName", label: "First name", type: "text" },
        { id: "spouseMiddleName", label: "Middle name", type: "text" },
        { id: "spouseLastName", label: "Last name", type: "text" },
        { id: "spouseBirthName", label: "Birth/Maiden name", type: "text" },
        { id: "spouseStreet", label: "Street address", type: "text" },
        { id: "spouseCity", label: "City", type: "text" },
        { id: "spouseState", label: "State", type: "text" },
        { id: "spouseZip", label: "Zip code", type: "text" },
        { id: "spouseCounty", label: "County", type: "text" },
        { id: "spouseCountyDuration", label: "How long in this county?", type: "text" },
        { id: "spouseHomePhone", label: "Home phone", type: "tel" },
        { id: "spouseCellPhone", label: "Cell phone", type: "tel" },
        { id: "spouseDob", label: "Date of birth", type: "date" },
        { id: "spousePlaceOfBirth", label: "Place of birth", type: "text" },
        { id: "spouseSsn", label: "SSN", type: "text" },
        { id: "spouseDriversLicense", label: "Driver's license number", type: "text" },
        { id: "spouseDriversLicenseState", label: "Issuing state", type: "text" },
        { id: "spouseAutoMake", label: "Automobile make", type: "text" },
        { id: "spouseAutoModel", label: "Automobile model", type: "text" },
        { id: "spouseAutoColor", label: "Automobile color", type: "text" },
        { id: "spouseAutoYear", label: "Automobile year", type: "text" },
        { id: "spouseHeight", label: "Height", type: "text" },
        { id: "spouseWeight", label: "Weight", type: "text" },
        { id: "spouseHairColor", label: "Hair color", type: "text" },
        { id: "spouseEyeColor", label: "Eye color", type: "text" },
        {
          id: "spouseGlasses",
          label: "Glasses?",
          type: "radio",
          options: [
            { label: "Yes", value: "yes" },
            { label: "No", value: "no" },
          ],
        },
        { id: "spouseEmail", label: "Email address", type: "email" },
        { id: "spouseRace", label: "Race", type: "text" },
        { id: "spouseEmployerAddress", label: "Place & address of employment", type: "text" },
        { id: "spouseOccupation", label: "Occupation", type: "text" },
        { id: "spouseAnnualIncome", label: "Approximate annual income", type: "text" },
      ],
    },
    {
      id: "marriage-info",
      title: "Marriage Information",
      fields: [
        { id: "marriageDate", label: "Marriage date", type: "date" },
        { id: "marriagePlace", label: "Place of marriage (city/state)", type: "text" },
        { id: "marriageCounty", label: "County", type: "text" },
      ],
    },
    {
      id: "children-info",
      title: "Child/Children Information",
      fields: [
        ...childFields(1),
        ...childFields(2),
        ...childFields(3),
        ...childFields(4),
      ],
    },
    {
      id: "guardians",
      title: "Guardians",
      fields: [
        ...guardianFields(1),
        ...guardianFields(2),
      ],
    },
    {
      id: "estate-assets",
      title: "Information About Your Estate",
      fields: [
        { id: "estateHomes", label: "Home(s)", type: "checkbox" },
        { id: "estateAutomobiles", label: "Automobile(s)", type: "checkbox" },
        { id: "estateBankAccounts", label: "Bank/Savings Account(s)", type: "checkbox" },
        { id: "estateRetirement", label: "Retirement Account(s)", type: "checkbox" },
        { id: "estateJewelry", label: "Jewelry", type: "checkbox" },
        { id: "estateValuables", label: "Valuables", type: "checkbox" },
        { id: "estateLifeInsurance", label: "Life Insurance", type: "checkbox" },
        { id: "estateBusiness", label: "Business Interests", type: "checkbox" },
        { id: "estateRoyalties", label: "Royalties", type: "checkbox" },
        { id: "estateTools", label: "Tools", type: "checkbox" },
        { id: "estateAntiques", label: "Antiques/Furniture", type: "checkbox" },
        { id: "estateVacationHome", label: "Vacation Home/Timeshare", type: "checkbox" },
        { id: "estatePets", label: "Pets", type: "checkbox" },
        { id: "estateArt", label: "Art", type: "checkbox" },
        { id: "estateCollectables", label: "Collectables", type: "checkbox" },
        { id: "estateOther", label: "Other", type: "checkbox" },
        { id: "estateOtherDetails", label: "Other details", type: "text", showIf: { fieldId: "estateOther", equals: true } },
      ],
    },
    {
      id: "executors",
      title: "Executors",
      fields: [
        ...executorFields(1),
        ...executorFields(2),
      ],
    },
    {
      id: "beneficiaries",
      title: "Beneficiaries",
      fields: [
        ...beneficiaryFields(1),
        ...beneficiaryFields(2),
        ...beneficiaryFields(3),
        ...beneficiaryFields(4),
      ],
    },
    {
      id: "referral",
      title: "Referral Information",
      fields: [
        { id: "referredBy", label: "Referred by", type: "text" },
        {
          id: "referralSource",
          label: "Referral source",
          type: "select",
          options: [
            { label: "Individual", value: "individual" },
            { label: "Website", value: "website" },
            { label: "Internet Search", value: "internet-search" },
            { label: "Former or Current Client", value: "client" },
            { label: "Attorney", value: "attorney" },
            { label: "Radio", value: "radio" },
            { label: "Facebook", value: "facebook" },
            { label: "Therapist", value: "therapist" },
            { label: "TV", value: "tv" },
            { label: "Other", value: "other" },
          ],
        },
        {
          id: "referralOther",
          label: "Other referral source",
          type: "text",
          showIf: { fieldId: "referralSource", equals: "other" },
        },
      ],
    },
  ],
};
