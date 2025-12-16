import "dotenv/config";
import { pool, getUserByUsername } from "../lib/db.js";
async function setAdminUser() {
    const ADMIN_USERNAME = process.env.ADMIN_USERNAME;
    if (!ADMIN_USERNAME) {
        console.error("ADMIN_USERNAME environment variable is not set");
        process.exit(1);
    }
    try {
        console.log(`Looking for user: ${ADMIN_USERNAME}...`);
        const user = await getUserByUsername(ADMIN_USERNAME);
        if (!user) {
            console.error(`User '${ADMIN_USERNAME}' not found in database`);
            console.log("Please create this user account first, then run this script again.");
            process.exit(1);
        }
        if (user.is_admin === 1) {
            console.log(`User '${ADMIN_USERNAME}' is already an admin`);
            process.exit(0);
        }
        // Set is_admin flag to 1
        await pool.query("UPDATE users SET is_admin = 1 WHERE username = $1", [ADMIN_USERNAME]);
        console.log(`✓ Successfully set '${ADMIN_USERNAME}' as admin`);
        process.exit(0);
    }
    catch (error) {
        console.error("Error setting admin user:", error);
        process.exit(1);
    }
}
setAdminUser();
//# sourceMappingURL=setAdmin.js.map