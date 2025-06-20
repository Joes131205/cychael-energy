/**
 * Energy Saving Tips Utility
 * This utility provides personalized energy saving tips based on device types and usage patterns
 */

export interface EnergySavingTip {
    id: string;
    title: string;
    description: string;
    category: string;
    impact: "low" | "medium" | "high";
    iconName: string;
}

// Base tips for various device categories
export const deviceCategoryTips: Record<string, EnergySavingTip[]> = {
    lighting: [
        {
            id: "light_1",
            title: "Switch to LED bulbs",
            description:
                "Replace traditional incandescent bulbs with LED alternatives to save up to 80% on lighting energy costs.",
            category: "lighting",
            impact: "high",
            iconName: "bulb-outline",
        },
        {
            id: "light_2",
            title: "Natural lighting",
            description:
                "Maximize natural daylight by opening curtains and blinds during the day instead of using electric lights.",
            category: "lighting",
            impact: "medium",
            iconName: "sunny-outline",
        },
        {
            id: "light_3",
            title: "Motion sensors",
            description:
                "Install motion sensors in less frequently used areas to ensure lights are only on when needed.",
            category: "lighting",
            impact: "medium",
            iconName: "eye-outline",
        },
    ],
    kitchen: [
        {
            id: "kitchen_1",
            title: "Full loads only",
            description:
                "Run dishwashers and washing machines only when full to maximize energy efficiency.",
            category: "kitchen",
            impact: "high",
            iconName: "water-outline",
        },
        {
            id: "kitchen_2",
            title: "Refrigerator efficiency",
            description:
                "Keep your refrigerator at 37-40°F and freezer at 0-5°F for optimal efficiency. Clean coils regularly.",
            category: "kitchen",
            impact: "medium",
            iconName: "snow-outline",
        },
        {
            id: "kitchen_3",
            title: "Cooking tips",
            description:
                "Use lids on pots to reduce cooking time, and match pot size to burner size for maximum efficiency.",
            category: "kitchen",
            impact: "medium",
            iconName: "flame-outline",
        },
    ],
    entertainment: [
        {
            id: "ent_1",
            title: "Smart power strips",
            description:
                "Use smart power strips to eliminate phantom power draw from entertainment systems when not in use.",
            category: "entertainment",
            impact: "high",
            iconName: "power-outline",
        },
        {
            id: "ent_2",
            title: "Optimize TV settings",
            description:
                "Reduce screen brightness and enable power-saving modes on TVs and monitors to decrease energy consumption.",
            category: "entertainment",
            impact: "medium",
            iconName: "tv-outline",
        },
    ],
    climate: [
        {
            id: "climate_1",
            title: "Programmable thermostat",
            description:
                "Install a programmable thermostat to automatically adjust temperature when you're asleep or away.",
            category: "climate",
            impact: "high",
            iconName: "thermometer-outline",
        },
        {
            id: "climate_2",
            title: "Regular maintenance",
            description:
                "Maintain HVAC systems with regular filter changes and professional tune-ups for peak efficiency.",
            category: "climate",
            impact: "high",
            iconName: "construct-outline",
        },
        {
            id: "climate_3",
            title: "Ceiling fans",
            description:
                "Use ceiling fans to circulate air and reduce the need for air conditioning. Reverse direction in winter.",
            category: "climate",
            impact: "medium",
            iconName: "repeat-outline",
        },
    ],
    office: [
        {
            id: "office_1",
            title: "Sleep settings",
            description:
                "Configure computers and monitors to use sleep mode when inactive for short periods.",
            category: "office",
            impact: "medium",
            iconName: "laptop-outline",
        },
        {
            id: "office_2",
            title: "Energy Star products",
            description:
                "Choose Energy Star certified office equipment for better energy efficiency.",
            category: "office",
            impact: "high",
            iconName: "star-outline",
        },
    ],
    other: [
        {
            id: "other_1",
            title: "Unplug unused devices",
            description:
                "Unplug chargers and devices when not in use to eliminate standby power consumption.",
            category: "other",
            impact: "medium",
            iconName: "battery-charging-outline",
        },
        {
            id: "other_2",
            title: "Regular energy audits",
            description:
                "Perform regular energy audits to identify new opportunities for energy savings.",
            category: "other",
            impact: "high",
            iconName: "search-outline",
        },
    ],
};

// Tips for specific usage patterns
export const usagePatternTips: Record<string, EnergySavingTip[]> = {
    highConsumption: [
        {
            id: "high_1",
            title: "Energy monitoring",
            description:
                "Install real-time energy monitors to identify and address high-consumption periods.",
            category: "highConsumption",
            impact: "high",
            iconName: "analytics-outline",
        },
        {
            id: "high_2",
            title: "Schedule usage",
            description:
                "Schedule high-energy activities during off-peak hours if your utility offers time-of-use rates.",
            category: "highConsumption",
            impact: "high",
            iconName: "time-outline",
        },
    ],
    standbyPower: [
        {
            id: "standby_1",
            title: "Smart plugs",
            description:
                "Use smart plugs to schedule power to devices that consume standby power.",
            category: "standbyPower",
            impact: "medium",
            iconName: "outlet-outline",
        },
    ],
    summerTips: [
        {
            id: "summer_1",
            title: "Summer cooling",
            description:
                "Close blinds during the day to keep heat out, and use fans instead of AC when possible.",
            category: "seasonal",
            impact: "high",
            iconName: "sunny-outline",
        },
    ],
    winterTips: [
        {
            id: "winter_1",
            title: "Winter heating",
            description:
                "Open curtains on sunny days to let in warmth, and close them at night to keep heat in.",
            category: "seasonal",
            impact: "high",
            iconName: "snow-outline",
        },
    ],
};

/**
 * Get personalized tips based on device list and usage patterns
 * @param devices List of user devices
 * @param energyData User's energy consumption data
 * @returns Array of personalized energy saving tips
 */
export const getPersonalizedTips = (
    devices: any[],
    energyData: {
        today: number;
        weekly: number;
        monthly: number;
        yearly: number;
    }
): EnergySavingTip[] => {
    if (!devices || devices.length === 0) {
        // Return general tips if no devices
        return [
            ...deviceCategoryTips.other,
            usagePatternTips.highConsumption[0],
        ];
    }

    const tips: EnergySavingTip[] = [];
    const categories = new Set<string>();

    // Collect all device categories
    devices.forEach((device) => {
        if (device.category) {
            categories.add(device.category);
        }
    });

    // Add tips for each device category
    categories.forEach((category) => {
        if (deviceCategoryTips[category]) {
            tips.push(...deviceCategoryTips[category]);
        }
    });

    // Check for high consumption patterns (more than 10 kWh daily)
    if (energyData.today > 10) {
        tips.push(...usagePatternTips.highConsumption);
    }

    // Check for standby power issues (many devices with low usage hours)
    const lowUsageDevices = devices.filter(
        (device) => device.hours < 2 && device.hours > 0
    );
    if (lowUsageDevices.length > 2) {
        tips.push(usagePatternTips.standbyPower[0]);
    }
    // Add seasonal tips
    const currentMonth = new Date().getMonth();
    // Summer months (May-September in Northern Hemisphere)
    if (currentMonth >= 4 && currentMonth <= 8) {
        tips.push(...usagePatternTips.summerTips);
    }
    // Winter months (November-March in Northern Hemisphere)
    else if (currentMonth >= 10 || currentMonth <= 2) {
        tips.push(...usagePatternTips.winterTips);
    }

    // Limit to max 8 tips and ensure no duplicates
    return Array.from(new Map(tips.map((tip) => [tip.id, tip])).values()).slice(
        0,
        8
    );
};
