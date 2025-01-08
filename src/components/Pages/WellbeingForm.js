import React, { useState } from "react";
import styles from "../../styles/formstyle.module.css";

const airtableFieldIDs = {
  name: "fldGQWRH8i2CYAvB1", // Airtable field ID for "Name"
  email: "fldOyQYkgJ8bjIAA8", // Airtable field ID for "Email Address"
  phone: "fldu236HwQ59qj94D", // Airtable field ID for "Phone Number"
  postcode: "fldQ6g39M366IJUM1", // Airtable field ID for "Postcode"
  serviceAccessed: "fld0LF9nyNoOcvMOM", // Airtable field ID for "How was this service accessed"
  ethnicity: "fld4cQInfFK3AGB99", // Airtable field ID for "Ethnicity"
  gender: "fldx12jZJwIsHTj2O", // Airtable field ID for "Gender"
  dob: "fldo3oBHv04ifJQdL", // Airtable field ID for "Date of Birth"
  livingWithPregnantPerson: "fldWkGl9X4YwQR2dX", // Airtable field ID for "Living with Partner?"
  gestation: "fldLjNR2V8fTYUD8L", // Airtable field ID for "Gestation Period"
  preferredContactMethods: "fld1YO1uvizsAtPof", // Airtable field ID for "Preferred Method of Contact"
  otherContactMethod: "fldr0byBLdNwY0kfv", // Airtable field ID for "Other Method of Contact"
  consent: "fld6XWbmq0mfUrCKx", // Airtable field ID for "Consent"
  confirmEligibility: "fldfla0da1qyZV7Kb", // Airtable field ID for "Confirm Eligability"
  localHub: "fldbIco8KuGrZ35cc", // Airtable field ID for "Local Hub"
  town: "fldzM3TmktMvZWMvE", // Add Town field ID
  localAuthority: "fldgtLzx0HcGJ7nOl", // Add Local Authority field ID
  location: "fldTQc0voyHuyXJeZ", // Add Location field ID
};

const airtableURL =
  "https://api.airtable.com/v0/appESMQNwIowYCCld/Wellbeing%20Review%20request%20form";

const WellbeingForm = () => {
  // State variables
  const [eligibility, setEligibility] = useState(false); // Declare inside the component
  const [showForm, setShowForm] = useState(false);
  const [selectedMethods, setSelectedMethods] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [otherContact, setOtherContact] = useState(""); // State for 'Other' contact input
  const [success, setSuccess] = useState(false); // State for success message
  const [localHub, setLocalHub] = useState(""); // State for Local Hub
  const [town, setTown] = useState("");
  const [localAuthority, setLocalAuthority] = useState("");
  const [location, setLocation] = useState("");

  const handleContinue = () => {
    const isEligible = document.getElementById("eligibility").checked; // Check the checkbox value

    if (isEligible) {
      setEligibility(true); // Persist eligibility in state
      setShowForm(true); // Show the main form
      setErrorMessage(""); // Clear any error messages
    } else {
      setErrorMessage("Please confirm eligibility.");
      document.getElementById("eligibility")?.focus(); // Focus on the checkbox
    }
  };

  // Handle postcode changes
  const handlePostcodeChange = async (event) => {
    let postcode = event.target.value.trim().toUpperCase();
  
    // Automatically format the postcode to include a space
    const postcodeRegex = /^[A-Z]{1,2}\d[A-Z\d]?\d[A-Z]{2}$/i; // Match unformatted postcode
    if (postcodeRegex.test(postcode)) {
      postcode = postcode.replace(
        /^([A-Z]{1,2}\d[A-Z\d]?)(\d[A-Z]{2})$/,
        "$1 $2"
      );
      event.target.value = postcode; // Update the input field
    } else {
      console.warn("Invalid postcode format:", postcode);
      return;
    }
  
    // Fetch details from the API
    const details = await fetchPostcodeDetails(postcode);
  
    if (details) {
      // Update state variables
      setTown(details.postTown || "Unknown"); // Use admin_ward for town
      setLocalAuthority(details.adminDistrict || "Unknown"); // Use admin_district for local authority
      setLocation(details.parish || "Unknown"); // Use parish for location
  
      console.log("Populated Fields:", {
        town: details.postTown || "Unknown",
        localAuthority: details.adminDistrict || "Unknown",
        location: details.parish || "Unknown",
      });
    } else {
      console.warn("Postcode not recognised or invalid.");
    }
  };
  

  const fetchPostcodeDetails = async (postcode) => {
    try {
      const response = await fetch(
        `https://api.postcodes.io/postcodes/${postcode}`
      );
      const data = await response.json();

      if (data.status === 200) {
        const details = data.result;
        console.log("Postcode Details:", details);

        return {
          postTown: details.admin_ward, // Change from post_town to admin_ward for Town
          adminDistrict: details.admin_district, // Local Authority
          parish: details.parish, // Location
        };
      } else {
        console.warn(`Postcode API Error: ${data.error}`);
        return null;
      }
    } catch (error) {
      console.error("Error fetching postcode details:", error);
      return null;
    }
  };

  const handleCheckboxChange = (event) => {
    const { value, checked } = event.target;
    if (checked) {
      setSelectedMethods([...selectedMethods, value]);
      if (value === "Other") setOtherContact(""); // Show 'Other' input box
    } else {
      setSelectedMethods(selectedMethods.filter((method) => method !== value));
      if (value === "Other") setOtherContact(""); // Clear 'Other' input box when unticked
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Retrieve all form values
    const formValues = {
      postcode: document.querySelector("#postcode")?.value.trim(),
      name: document.querySelector("#name")?.value.trim(),
      email: document.querySelector("#email")?.value.trim(),
      phone: document.querySelector("#phone")?.value.trim(),
      consent: document.querySelector("#consent")?.checked,
      serviceAccessed: document.querySelector("#serviceAccessed")?.value.trim(),
      ethnicity: document.querySelector("#ethnicity")?.value.trim(),
      gender: document.querySelector("#gender")?.value.trim(),
      dob: document.querySelector("#dob")?.value.trim(),
      livingWithPregnantPerson: document.querySelector(
        'input[name="livingWithPregnantPerson"]:checked'
      )?.value,
      gestation: document.querySelector("#gestation")?.value.trim(),
      town: town, // Use state variable
      localAuthority: localAuthority, // Use state variable
      location: location, // Use state variable
    };

    // Debug: Log form values before submission
    console.log("Form Values:", formValues);

    // Check eligibility
    if (!eligibility) {
      setErrorMessage("Please confirm eligibility.");
      document.querySelector("#eligibility")?.focus();
      return;
    }

    // Required fields validation
    const requiredFields = [
      { key: "postcode", message: "Postcode is required." },
      { key: "name", message: "Name is required." },
      { key: "consent", message: "Consent is required.", isBoolean: true },
      { key: "ethnicity", message: "Ethnicity is required." },
      { key: "gender", message: "Gender is required." },
      { key: "dob", message: "Date of Birth is required." },
      {
        key: "livingWithPregnantPerson",
        message: "Living with pregnant person status is required.",
      },
      { key: "gestation", message: "Gestation period is required." },
    ];

    for (const field of requiredFields) {
      if (
        (field.isBoolean && !formValues[field.key]) ||
        (!field.isBoolean && !formValues[field.key]?.trim())
      ) {
        setErrorMessage(field.message);
        document.querySelector(`#${field.key}`)?.focus();
        return;
      }
    }

    // Additional validations
    if (
      selectedMethods.includes("Microsoft Teams") ||
      selectedMethods.includes("Zoom")
    ) {
      if (!formValues.email) {
        setErrorMessage("Email is required for Microsoft Teams or Zoom.");
        document.querySelector("#email")?.focus();
        return;
      }
    }

    if (selectedMethods.includes("Other") && !otherContact?.trim()) {
      setErrorMessage(
        "Please specify your preferred contact method under 'Other'."
      );
      document.querySelector("#otherContact")?.focus();
      return;
    }

    if (selectedMethods.includes("Phone Call")) {
      if (!formValues.phone) {
        setErrorMessage("Phone number is required for Phone Call.");
        document.querySelector("#phone")?.focus();
        return;
      }
      const phonePattern = /^(\+44|0)7\d{9}$/;
      if (!phonePattern.test(formValues.phone)) {
        setErrorMessage("Please provide a valid UK phone number.");
        document.querySelector("#phone")?.focus();
        return;
      }

      
    }

    // Determine localHub based on postcode
    const hub = determineHub(formValues.postcode);
    setLocalHub(hub || "Not Recognised");

    if (hub === "Not Recognised") {
      console.warn(
        `Unmapped postcode (${formValues.postcode}) submitted with Local Hub set to "Not Recognised".`
      );
    }

    // Debug: Log form values before submission
    console.log("Form Values:", {
      ...formValues,
      hub,
      selectedMethods,
      otherContact,
    });

    // Prepare data for Airtable submission
    const airtableData = {
      records: [
        {
          fields: {
            [airtableFieldIDs.name]: formValues.name,
            [airtableFieldIDs.email]: formValues.email,
            [airtableFieldIDs.phone]: formValues.phone,
            [airtableFieldIDs.postcode]: formValues.postcode,
            [airtableFieldIDs.localHub]: hub,
            [airtableFieldIDs.serviceAccessed]: formValues.serviceAccessed,
            [airtableFieldIDs.ethnicity]: formValues.ethnicity,
            [airtableFieldIDs.gender]: formValues.gender,
            [airtableFieldIDs.dob]: formValues.dob,
            [airtableFieldIDs.livingWithPregnantPerson]:
              formValues.livingWithPregnantPerson,
            [airtableFieldIDs.gestation]: formValues.gestation,
            [airtableFieldIDs.preferredContactMethods]: selectedMethods,
            [airtableFieldIDs.otherContactMethod]: otherContact || null,
            [airtableFieldIDs.consent]: formValues.consent,
            [airtableFieldIDs.town]: formValues.town,
            [airtableFieldIDs.localAuthority]: formValues.localAuthority,
            [airtableFieldIDs.location]: formValues.location,
          },
        },
      ],
    };

    // Log payload before sending
    console.log("Airtable Payload:", airtableData);

    try {
      // Submit data to Airtable
      const response = await fetch(airtableURL, {
        method: "POST",
        headers: {
          Authorization: `Bearer patSU10Pp0hh1NOgo.7554e4280a027e73e31574edeff1ad25a40803a6aabe8f111f34aa0721c48d80`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(airtableData),
      });

      const responseData = await response.json();
      console.log("Airtable API Response:", responseData);

      if (!response.ok) {
        console.error("Error from Airtable API:", responseData);
        console.log("Request Payload:", airtableData);
        setErrorMessage(
          `Failed to submit the form. Airtable error: ${
            JSON.stringify(responseData.error) || "Unknown error"
          }`
        );
        return;
      }

      // Success state
      setSuccess(true);
    } catch (error) {
      console.error("Error submitting to Airtable:", error);
      setErrorMessage(
        "An error occurred while submitting the form. Please try again."
      );
    }
  };

  // Function to render success message
  const renderSuccessMessage = () => (
    <div className={styles.successMessage}>
      <h1>Thank You!</h1>
      <p>Your form has been submitted successfully.</p>
      <p>
        If you provided an email address, you will receive a confirmation email
        shortly. Otherwise, our Fathers & Partners Wellbeing coordinator will
        contact you within 7 days via your selected preferred method of contact
        (if possible).
      </p>
      <button
        onClick={() =>
          (window.top.location.href =
            "https://parents1st.org.uk/the-other-half-hub")
        }
        style={{
          backgroundColor: "#D78223",
          color: "white",
          padding: "10px",
          borderRadius: "4px",
          cursor: "pointer",
          fontSize: "18px",
        }}
      >
        Return to The Other Half-Hub
      </button>
    </div>
  );

  return (
    <div className={styles.wellbeingFormContainer}>
      {success ? (
        renderSuccessMessage() // Show success message if form submission was successful
      ) : !showForm ? (
        <div className={styles.prescreening}>
          <h2>Eligibility Confirmation</h2>
          <p>
            Please confirm that your partner is currently under the care of EPUT
            (Essex Partnership University Trust).
          </p>
          <label>
            <input type="checkbox" id="eligibility" />
            Confirm Eligibility
          </label>
          <button
            className={styles.fancyButton}
            onClick={handleContinue}
            aria-label="Confirm eligibility and continue"
          >
            Continue
          </button>
          {errorMessage && <div className={styles.error}>{errorMessage}</div>}
        </div>
      ) : (
        <div className={styles.formContainer}>
          <h1>Wellbeing Review Request Form</h1>
          {errorMessage && <div className={styles.error}>{errorMessage}</div>}
          <form onSubmit={handleSubmit}>
            {/* Name and Postcode (Row 1) */}
            <div className={styles.row}>
              <div className={styles.column}>
                <label htmlFor="name">
                  Name: <span className={styles.required}>*</span>
                </label>
                <input
                  className={styles.input}
                  id="name"
                  placeholder="Your Name"
                  required
                />
              </div>
              <div className={styles.column}>
                <label htmlFor="postcode">
                  Postcode: <span className={styles.required}>*</span>
                </label>
                <input
                  className={styles.input}
                  id="postcode"
                  placeholder="Your Postcode"
                  onChange={handlePostcodeChange}
                  required
                />
                {/* Local Hub Field (hidden from user) */}
                <input
                  type="hidden"
                  id="localHub"
                  value={localHub} // Store the calculated hub
                />
              </div>
            </div>

            {/* Additional Hidden Fields for New API Data */}
            <input type="hidden" id="town" name="town" value={town} />
            <input
              type="hidden"
              id="localAuthority"
              name="localAuthority"
              value={localAuthority}
            />
            <input
              type="hidden"
              id="location"
              name="location"
              value={location}
            />

            {/* Email Address and Phone Number (Row 2) */}
            <div className={styles.row}>
              <div className={styles.column}>
                <label htmlFor="email">Email Address:</label>
                <input
                  className={styles.input}
                  id="email"
                  placeholder="Your Email Address"
                />
              </div>
              <div className={styles.column}>
                <label htmlFor="phone">Phone Number:</label>
                <input
                  className={styles.input}
                  id="phone"
                  placeholder="Your Phone Number"
                />
              </div>
            </div>

            {/* Date of Birth (Row 3 - Centered) */}
            <div className={styles.rowCentered}>
              <div className={styles.singleColumn}>
                <label htmlFor="dob">
                  Date of Birth: <span className={styles.required}>*</span>
                </label>
                <input type="date" className={styles.input} id="dob" required />
              </div>
            </div>

            {/* Gender and Ethnicity (Row 4) */}
            <div className={styles.row}>
              <div className={styles.column}>
                <label htmlFor="gender">
                  Gender: <span className={styles.required}>*</span>
                </label>
                <select className={styles.input} id="gender" required>
                  <option value="" disabled selected>
                    Select an option
                  </option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Non-Binary">Non-Binary</option>
                  <option value="Other">Other</option>
                  <option value="Prefer Not to Say">Prefer Not to Say</option>
                </select>
              </div>

              <div className={styles.column}>
                <label htmlFor="ethnicity">
                  Ethnicity: <span className={styles.required}>*</span>
                </label>
                <select className={styles.input} id="ethnicity" required>
                  <option value="" disabled selected>
                    Select an option
                  </option>
                  <option value="White">White</option>
                  <option value="Black or African">Black or African</option>
                  <option value="Asian">Asian</option>
                  <option value="Mixed">Mixed</option>
                  <option value="Other">Other</option>
                  <option value="Prefer Not to Say">Prefer Not to Say</option>
                </select>
              </div>
            </div>

            {/* Preferred Method of Contact */}
            <div className={styles.row}>
              <div className={styles.columnFull}>
                <label>Preferred Method of Contact:</label>
                <div className={styles.checkboxGroup}>
                  {["Phone Call", "Microsoft Teams", "Zoom", "Other"].map(
                    (method) => (
                      <label key={method}>
                        <input
                          type="checkbox"
                          value={method}
                          onChange={handleCheckboxChange}
                        />
                        {method}
                      </label>
                    )
                  )}
                  {selectedMethods.includes("Other") && (
                    <textarea
                      className={styles.textarea}
                      id="otherContact"
                      placeholder="e.g., Text Messages (SMS) or WhatsApp"
                      value={otherContact}
                      onChange={(e) => setOtherContact(e.target.value)}
                    />
                  )}
                </div>
              </div>
            </div>

            {/* Gestation Period and How Service Was Accessed */}
            <div className={styles.row}>
              <div className={styles.column}>
                <label htmlFor="gestation">
                  Gestation Period: <span className={styles.required}>*</span>
                </label>
                <select className={styles.input} id="gestation" required>
                  <option value="" disabled selected>
                    Select an option
                  </option>
                  <option value="Prenatal">
                    Prenatal (Before the baby is born)
                  </option>
                  <option value="Postnatal">
                    Postnatal (Up to 6 weeks after birth)
                  </option>
                  <option value="Postpartum">
                    Postpartum (Beyond 6 weeks after birth)
                  </option>
                  <option value="Prefer Not to Say">Prefer Not to Say</option>
                </select>
              </div>

              <div className={styles.column}>
                <label htmlFor="serviceAccessed">
                  How did you find us?{" "}
                  <span className={styles.required}>*</span>
                </label>
                <select className={styles.input} id="serviceAccessed" required>
                  <option value="" disabled selected>
                    Select an option
                  </option>
                  <option value="GP">GP</option>
                  <option value="Midwife">Midwife</option>
                  <option value="QR Code">QR Code</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            {/* Living with Pregnant Partner */}
            <div className={styles.row}>
              <div className={styles.columnFull}>
                <label>
                  Are you living with your partner?{" "}
                  <span className={styles.required}>*</span>
                </label>
                <div className={styles.radioGroup}>
                  <label>
                    <input
                      type="radio"
                      name="livingWithPregnantPerson"
                      value="Yes"
                      required
                    />{" "}
                    <strong>Yes</strong>
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="livingWithPregnantPerson"
                      value="No"
                    />{" "}
                    <strong>No</strong>
                  </label>
                </div>
              </div>
            </div>
            <strong>Consent Statement:</strong>
            <p className={styles.consent}>
              Are you happy for us to store the information we may talk about?
              We will look after any personal information that is shared with
              us. This is central to our values as an organisation. We want
              everyone who interacts with us to feel confident about how any
              personal information they share will be looked after or used.
              <br />
              <br />
              You can be confident that:
              <br />• We only use personal information in the ways we need to,
              that is expected of us and that we have a lawful basis for.
              <br />• We respect the rights you have as an individual by having
              procedures in place to protect these.
              <br />• We will make it easy for you to tell us how you want us to
              communicate with you, including how to opt out from future
              communications, rectify inaccurate data or request access—and your
              request will be respected in a timely manner.
              <br />• We will never release your information to organisations
              outside Parents 1st for their marketing purposes.
              <br />• We take all reasonable care to safeguard your personal
              information through security policies and secure business
              processes.
              <br />• We will provide easy ways for you to contact us. We are
              always happy to answer any queries you have, at any time.
              <br />
              <br />
              We will need to store the information you have given us today
              securely on our computer system or on paper.
              <br />
              <br />
              We will need to use the information in order to recommend
              resources and services we think might benefit you the most.
              <br />
              <br />
              How we share and store your personal information:
              <br />• Your Wellbeing Coordinator will record and store
              information about you and the support you are receiving. This will
              be done using a code to protect your identity and your personal
              details will be stored separately.
              <br />• Your Wellbeing Coordinator will share information on a
              regular basis with their supervisor so as to help us provide you
              with the best possible service.
              <br />• For monitoring and evaluation, we may share information
              with partner organisations and those who provide the funding. You
              will not be identified by name and only numbers and statistics are
              given. The only exception to this is that we may provide the NHS
              with information that does identify you, and your baby via your
              NHS number.
              <br />• In any other circumstances, we will ask for your consent
              before we share any personal information about you or your family
              and tell you that we are going to do so.
              <br />• We will not ask for your consent and may not inform you
              that we are going to share information if there is a risk of
              significant or serious harm to a child or adult or if it is in the
              public interest not to do so.
              <br />
              <br />
              If you would like more information about our confidentiality, data
              protection, and information sharing policies and procedures,
              please let us know.
              <br />
              <br />
              <a
                href="https://www.dropbox.com/scl/fi/zgsch7s77gtat9g19bntw/Information-Sharing-Agreement-Essex-Peer-to-Parent-Network.docx?rlkey=m1bahd0u8a63j6tqpz4pknry4&st=58fot45o&dl=0"
                target="_blank"
                rel="noopener noreferrer"
              >
                Parents 1st - Information Sharing Agreement
              </a>
              <br />
              <br />
              Please confirm that you understand how the information you have
              given us will be used, shared, and stored by us and that you give
              your consent for this by checking the box below.
            </p>
            <div className={styles.consentandsubmit}>
              <label>
                <input type="checkbox" id="consent" required /> Consent{" "}
                <span className={styles.required}>
                  <font color="red">*</font>
                </span>
              </label>
              <button className={styles.fancyButton} type="submit">
                Submit
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

// Mapping of postcodes to hubs
const postcodeToHubMap = {
  "North Essex": {
    "North East": [
      "CO1", // Colchester
      "CO2", // Old Heath, Berechurch, Layer de la Haye
      "CO3", // Lexden, Fordham Heath, Stanway
      "CO4", // Greenstead, Highwoods, St Johns, Myland, Boxted, Braiswick
      "CO5", // Tiptree, Kelvedon, Westy Mersea, Peldon, Rowhedge
      "CO6", // Coggeshall, Earls Colne, Marks Tey, Great Tey, Chappel, White Colne, Wakes Colne, Fordham, Copford, West Bergholt, Great Horkesley, Wormingford, Nayland, Stroke-by-Nayland, Polstead
      "CO7", // Brightlingsea, Wivenhoe, Great Bentley, Alresford
      "CO8", // Bures
      "CO9", // Halsted
      "CO10", // Sudbury
      "CO11", // Manningtree
      "CO12", // Harwich (Tendering)
      "CO13", // Frinton-on-Sea
      "CO14", // Walton-on-the-Naze
      "CO15", // Clacton-on-Sea, Jaywick
      "CO16",
    ], // Clacton-on-Sea, St Osyth, Little Clacton

    "North West": [
      "CM16", // Epping
      "CM17",
      "CM18",
      "CM19",
      "CM20", // Harlow
      "CM21", // Sawbridgeworth
      "CM22",
      "CM23", // Bishops Stortford
      "CM24", // Stansted
      "CB10",
      "CB11", // Uttlesford
      "EN9",
      "IG10",
    ], // Epping Forest
  },

  "Mid Essex": [
    "CM0", //Maldon
    "CM1",
    "CM2",
    "CM3", // Chelmsford
    "CM4", // Ingatestone
    "CM5", // Ongar
    "CM6", // Dunmow
    "CM7", // Braintree
    "CM8", // Witham
    "CM9", // Maldon
  ],

  "South Essex": {
    "South West": [
      "SS13",
      "SS14",
      "SS15",
      "SS16", //Basildon
      "SS11",
      "SS12", //Wickford
      "CM11",
      "CM12", //Billericay
      "CM13",
      "CM14",
      "CM15", //Brentwood
      "RM15",
      "RM16",
      "RM17",
      "RM18",
      "RM19",
      "RM20", // Thurrock
      "CM4",
    ], // Ingatestone
    "South East": [
      "SS0",
      "SS1",
      "SS2",
      "SS3", // Southend
      "SS4", // Rochford
      "SS5", // Hockley
      "SS6", // Rayleigh
      "SS7", // Benfleet
      "SS8", // Canvey Island
      "SS9",
      "SS11",
    ], // Southend
  },
};

// Function to determine the hub based on postcode
const determineHub = (postcode) => {
  const outwardCode = postcode.trim().split(" ")[0].toUpperCase();
  console.log("Outward Code:", outwardCode); // Debugging

  // Check each main region and its sub-regions
  for (const [region, hubs] of Object.entries(postcodeToHubMap)) {
    if (Array.isArray(hubs)) {
      // Handle regions without sub-regions (like Mid Essex)
      if (hubs.includes(outwardCode)) {
        console.log(`Mapped Hub: ${region}`);
        return region; // Return region only
      }
    } else {
      // Handle regions with sub-regions (like North Essex, South Essex)
      for (const [subRegion, postcodes] of Object.entries(hubs)) {
        if (postcodes.includes(outwardCode)) {
          const formattedHub = `${region} (${subRegion})`; // Correct format for Airtable
          console.log(`Mapped Hub: ${formattedHub}`);
          return formattedHub;
        }
      }
    }
  }




  // Fallback for unmapped postcodes
  console.log("Unknown Hub for:", outwardCode);
  return "Not Recognised"; // Default for Airtable's "Not Recognised" option
};

export default WellbeingForm;
