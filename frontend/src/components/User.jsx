import { useAuth } from "../Context/AuthContext";
import { LogOut } from "../index"

function User() {
    const { user } = useAuth();
    return (
        <>
            {user ? (
                <div className="p-6 min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950">
                    <h1 className="text-3xl font-bold mb-6 text-gray-100">
                        User Details
                    </h1>

                    <div className="space-y-3 mb-8 text-gray-300">
                        <p className="text-lg">
                            <span className="font-semibold">Full Name:</span>{" "}
                            {user?.fullName}
                        </p>
                        <p className="text-lg">
                            <span className="font-semibold">Username:</span>{" "}
                            {user?.username}
                        </p>
                        <p className="text-lg">
                            <span className="font-semibold">Email:</span>{" "}
                            {user?.email}
                        </p>
                    </div>

                    <div className="grid md:grid-cols-4 gap-8">
                        <div className="bg-gray-800 rounded-xl shadow p-4 col-span-1">
                            <label className="block text-sm font-medium mb-2 text-gray-300">
                                Avatar
                            </label>
                            <img
                                src={user?.avatar}
                                alt="User Avatar"
                                className="w-full h-64 object-cover rounded-lg border"
                            />
                        </div>

                        <div className="bg-gray-800 rounded-xl shadow p-4 col-span-2">
                            <label className="block text-sm font-medium mb-2 text-gray-300">
                                Cover Image
                            </label>
                            <img
                                src={user?.coverImage}
                                alt="User Cover"
                                className="w-full h-64 object-cover rounded-lg border"
                            />
                        </div>
                    </div>

                    <div className="mt-10">
                        <LogOut/>
                    </div>
                </div>
            ) : (
                <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
                    <h1 className="text-2xl font-semibold text-gray-700 dark:text-gray-200">
                        Please Login First
                    </h1>
                </div>
            )}
        </>
    );
}

export default User;
