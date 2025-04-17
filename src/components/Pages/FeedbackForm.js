import React, { useState, useEffect } from "react";
import globalStyles from "../../styles/globalstyle.module.css";
import styles from "../../styles/formstyle.module.css";
import emailjs from "emailjs-com";

const FeedbackForm = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [navigationFeedback, setNavigationFeedback] = useState("");
    const [participationReason, setParticipationReason] = useState("");
    const [reviewThoughts, setReviewThoughts] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const maxReviewLength = 20000;

    const [ref, setRef] = useState("");

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const urlRef = params.get("ref");
        if (urlRef) setRef(urlRef);
    }, []);


    // Function to send the email using an alternative service.
    // Replace the URL and logic below with your own email sending endpoint.
    const sendEmail = async (feedbackData) => {
        const emailParams = {
            from_name: feedbackData.name || "Anonymous",
            to_name: "Richard",
            message: `
    📝 Feedback Form Submission
    
    🔗 Ref ID: ${ref || "N/A"}
    
    • Name: ${feedbackData.name || "N/A"}
    • Email: ${feedbackData.email || "N/A"}
    
    Navigation Experience:
    ${feedbackData.navigationFeedback || "N/A"}
    
    Reason for Participation:
    ${feedbackData.participationReason || "N/A"}
    
    Thoughts on Wellbeing Review:
    ${feedbackData.reviewThoughts || "N/A"}
      `,
        };


        return emailjs.send(
            "service_2w9430q", // Your existing service ID
            "template_xu5y5s5", // Directory Template ID
            emailParams,
            "LAfohc7pbH72TTtnE" // Your public API key
        );
    };

    // Form submission handler.
    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!reviewThoughts.trim()) {
            setErrorMessage("Please share your thoughts on the Wellbeing Review.");
            return;
        }
        setErrorMessage("");
        const feedbackData = {
            name,
            email,
            navigationFeedback,
            participationReason,
            reviewThoughts,
        };

        try {
            // Send the email via your chosen email service
            await sendEmail(feedbackData);
            // You may also store the feedback data elsewhere if needed
            setSubmitted(true);
        } catch (error) {
            setErrorMessage("Failed to send email. Please try again later.");
        }
    };

    if (submitted) {
        return <ThankYouPage />;
    }

    return (
        <div className={globalStyles.container}>
            <div className={styles.formContainer}>
                <h1>Feedback Form - The Other Half Hub - Parents 1st</h1>
                {errorMessage && <div className={styles.error}>{errorMessage}</div>}
                <form onSubmit={handleSubmit}>
                    {/* Optional Name and Email fields */}
                    <div className={styles.row}>
                        <div className={styles.column}>
                            <label htmlFor="name">Name (Optional):</label>
                            <input
                                type="text"
                                id="name"
                                className={styles.input}
                                placeholder="Your Name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
                        <div className={styles.column}>
                            <label htmlFor="email">Email (Optional):</label>
                            <input
                                type="email"
                                id="email"
                                className={styles.input}
                                placeholder="Your Email Address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                    </div>
                    {/* Specific Question 1 */}
                    <div className={styles.rowCentered}>
                        <div className={styles.columnFull}>
                            <label htmlFor="navigationFeedback">
                                How easily did you find navigating the website?
                            </label>
                            <textarea
                                id="navigationFeedback"
                                className={styles.textarea}
                                placeholder="Share your experience with website navigation..."
                                value={navigationFeedback}
                                onChange={(e) => setNavigationFeedback(e.target.value)}
                            ></textarea>
                        </div>
                    </div>
                    {/* Specific Question 2 */}
                    <div className={styles.rowCentered}>
                        <div className={styles.columnFull}>
                            <label htmlFor="participationReason">
                                What made you decide to participate in the service?
                            </label>
                            <textarea
                                id="participationReason"
                                className={styles.textarea}
                                placeholder="Let us know what motivated you..."
                                value={participationReason}
                                onChange={(e) => setParticipationReason(e.target.value)}
                            ></textarea>
                        </div>
                    </div>
                    {/* Large Text Field with Character Counter */}
                    <div className={styles.rowCentered}>
                        <div className={styles.columnFull}>
                            <label htmlFor="reviewThoughts">
                                What were your thoughts on the Wellbeing Review and how it was
                                carried out? <span className={styles.required}>*</span>
                            </label>
                            <textarea
                                id="reviewThoughts"
                                className={styles.textarea}
                                placeholder="Share your detailed feedback..."
                                value={reviewThoughts}
                                onChange={(e) => setReviewThoughts(e.target.value)}
                                maxLength={maxReviewLength}
                                style={{ height: "200px" }}
                                required
                            ></textarea>
                            <div
                                style={{ textAlign: "right", fontSize: "14px", color: "#666" }}
                            >
                                {reviewThoughts.length}/{maxReviewLength} characters
                            </div>
                        </div>
                    </div>
                    <div className={styles.consentandsubmit}>
                        <button type="submit" className={styles.fancyButton}>
                            Submit Feedback
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// Thank You Page Component with Countdown Timer and Redirect
const ThankYouPage = () => {
    const [countdown, setCountdown] = useState(10);

    useEffect(() => {
        const timer =
            countdown > 0 &&
            setInterval(() => {
                setCountdown((prev) => prev - 1);
            }, 1000);
        if (countdown === 0) {
            window.location.href = "https://parents1st.org.uk/the-other-half-hub";
        }
        return () => clearInterval(timer);
    }, [countdown]);

    return (
        <div className={globalStyles.container}>
            <div className={styles.prescreening}>
                <h1>Thank You!</h1>
                <p>Your feedback has been submitted successfully.</p>
                <p>
                    You will be redirected in {countdown} second
                    {countdown !== 1 ? "s" : ""}.
                </p>
                <p>
                    If you are not redirected automatically, please click{" "}
                    <a href="https://parents1st.org.uk/the-other-half-hub">here</a>.
                </p>
            </div>
        </div>
    );
};

export default FeedbackForm;
