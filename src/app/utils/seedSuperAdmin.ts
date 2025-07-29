import { envVars } from "../config/env"
import { IAuthProviders, IUser, Role } from "../modules/user/user.interface"
import { User } from "../modules/user/user.model"
import bcryptjs from "bcryptjs"

export const seedSuperAdmin = async () => {
    try {

        const isSuperAdminExist = await User.findOne({ email: envVars.SUPER_ADMIN_EMAIL })
        if (isSuperAdminExist) {
            console.log("Super Admin Exist....")
            return
        }

        const hashedPassword = await bcryptjs.hash(envVars.SUPER_ADMIN_PASSWORD, Number(envVars.BCRYPT_SALT_ROUND))

        const authProvider: IAuthProviders={
            provider: "credentials",
            providerId: envVars.SUPER_ADMIN_EMAIL
        }
        const payload: IUser = {
            name: "Super Duper Admin",
            email: envVars.SUPER_ADMIN_EMAIL,
            role: Role.SUPER_ADMIN,
            password: hashedPassword,
            phone: "018********",
            address: {
                division: "xyz",
                city: "xyz",
                area: "xyz"
            },
            isVerified: true,
            auths: [authProvider]
        }

        const superAdmin = await User.create(payload)

        console.log("super admin created successfully",superAdmin)

    } catch (error) {
        console.log(error)
    }
}