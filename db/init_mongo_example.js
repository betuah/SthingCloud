db.createUser(
    {
        user: "YOUR_USERNAME",
        pwd: "YOUR_PASSWORD",
        roles: [
            {
                role : "readWriteAnyDatabase",
                db : "admin"
            },
            {
                role : "userAdminAnyDatabase",
                db : "admin"
            },
            {
                role: "root",
                db : "admin"
            }
        ]
    }
)