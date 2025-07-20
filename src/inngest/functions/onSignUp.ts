import { NonRetriableError } from "inngest";
import { inngest } from "../client";
import User from "../../models/User";
import { sendMail } from "../../utils/mailer";

export default inngest.createFunction(
  { id: "send-email", retries: 3 },
  { event: "user/signup" },
  async ({ event, step }) => {
    try {
      const { email } = event.data;
      await step.run("get-user-email", async () => {
        const user = await User.findOne({ email });
        if (!user) {
          throw new NonRetriableError("User not found in our database");
        }
        return user;
      });
      await step.run("send-welcome-email", async ({ user }) => {
        const subject = "Welcome to our platform";
        const message = `Hi , welcome to our platform
         \n\n
         Thanks for signing up`;
        await sendMail(user.email, subject, message);
      });
      return { success: true };
    } catch (error) {
      console.log(error, "Error running step");
      return { success: false };
    }
  }
);
