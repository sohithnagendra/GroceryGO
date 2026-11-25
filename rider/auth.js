// ==========================================
// GROCERYGO RIDER AUTHENTICATION SYSTEM
// Uses GroceryStore as single source of truth (localStorage key: "riders")
// ==========================================

const ACTIVE_RIDER_KEY = "groceryGoActiveRider";
const RIDER_ACCESS_CODE = "5843";

// ==========================================
// RIDER DATA ACCESS - Delegates to GroceryStore
// ==========================================

function getRiders() {
    // Use GroceryStore as single source of truth
    if (window.GroceryStore && window.GroceryStore.getRiders) {
        return window.GroceryStore.getRiders();
    }
    // Fallback during initialization
    try {
        return JSON.parse(localStorage.getItem("riders")) || [];
    } catch (error) {
        console.error("Could not read riders:", error);
        return [];
    }
}

function saveRiders(riders) {
    if (window.GroceryStore && window.GroceryStore.saveRiders) {
        window.GroceryStore.saveRiders(riders);
    } else {
        localStorage.setItem("riders", JSON.stringify(riders));
    }
}

// ==========================================
// GET CURRENT RIDER (from session/localStorage)
// ==========================================

function getCurrentRider() {
    try {
        const localRider = localStorage.getItem(ACTIVE_RIDER_KEY);
        if (localRider) {
            return JSON.parse(localRider);
        }
        const sessionRider = sessionStorage.getItem(ACTIVE_RIDER_KEY);
        if (sessionRider) {
            return JSON.parse(sessionRider);
        }
    } catch (error) {
        console.error("Could not read current rider:", error);
    }
    return null;
}

// ==========================================
// SET CURRENT RIDER (session/localStorage)
// ==========================================

function setCurrentRider(rider, rememberMe = false) {
    localStorage.removeItem(ACTIVE_RIDER_KEY);
    sessionStorage.removeItem(ACTIVE_RIDER_KEY);

    // Store rider without password for security
    const sessionRider = {
        id: rider.id,
        name: rider.name,
        email: rider.email,
        phone: rider.phone,
        vehicleType: rider.vehicleType,
        vehicleNumber: rider.vehicleNumber,
        drivingLicenseNumber: rider.drivingLicenseNumber,
        status: rider.status,
        joiningDate: rider.joiningDate,
        assignedOrders: rider.assignedOrders || [],
        totalDeliveries: rider.totalDeliveries || 0,
        totalEarnings: rider.totalEarnings || 0,
        availability: rider.availability || rider.status || "Available",
        // Extended profile fields
        dateOfBirth: rider.dateOfBirth,
        gender: rider.gender,
        address: rider.address,
        city: rider.city,
        pincode: rider.pincode,
        emergencyContactName: rider.emergencyContactName,
        emergencyContactNumber: rider.emergencyContactNumber,
        vehicles: rider.vehicles || [],
        documents: rider.documents || [],
        preferences: rider.preferences || { email: true, push: true, sms: false, autoAccept: false },
        twoFactorEnabled: rider.twoFactorEnabled || false,
        avatar: rider.avatar
    };

    if (rememberMe) {
        localStorage.setItem(ACTIVE_RIDER_KEY, JSON.stringify(sessionRider));
    } else {
        sessionStorage.setItem(ACTIVE_RIDER_KEY, JSON.stringify(sessionRider));
    }
}

// ==========================================
// RIDER LOGOUT
// ==========================================

function riderLogout() {
    localStorage.removeItem(ACTIVE_RIDER_KEY);
    sessionStorage.removeItem(ACTIVE_RIDER_KEY);

    const isNestedPage = window.location.pathname.includes("/rider/");
    window.location.href = isNestedPage ? "login.html" : "rider/login.html";
}

// ==========================================
// MESSAGE HELPER
// ==========================================

function showMessage(element, message, color) {
    if (!element) return;
    element.textContent = message;
    element.style.color = color;
}

// ==========================================
// PAGE PROTECTION
// ==========================================

function protectRiderPage() {
    const rider = getCurrentRider();
    const isNestedPage = window.location.pathname.includes("/rider/");
    const loginUrl = isNestedPage ? "login.html" : "rider/login.html";

    if (!rider) {
        window.location.href = loginUrl;
        return null;
    }
    return rider;
}

// ==========================================
// GLOBAL RIDER AUTH OBJECT
// ==========================================

window.GroceryRiderAuth = {
    getCurrentRider,
    setCurrentRider,
    logout: riderLogout,
    protectPage: protectRiderPage,
    getRiders,
    saveRiders,
    RIDER_ACCESS_CODE
};

// Global aliases for direct HTML onclick handlers
window.riderLogout = riderLogout;
window.getCurrentRider = getCurrentRider;
window.protectRiderPage = protectRiderPage;