/**
 * Get the flag emoji by country code
 * @param code
 */
export function getFlagByCountryCode(code: string) {
    switch (code.toLowerCase()){
        case "de":
            return "🇩🇪";
        case "us":
            return "🇺🇸";
        case "ca":
            return "🇨🇦";
        case "fr":
            return "🇫🇷";
        case "it":
            return "🇮🇹";
        case "au":
            return "🇦🇺";
        case "ie":
            return "🇮🇪";
        case "nz":
            return "🇳🇿";
        case "uk":
            return "🇬🇧";
        case "na":
            return "🇳🇦";
        case "za":
            return "🇿🇦";
        case "is":
            return "🇮🇸";
        case "fi":
            return "🇫🇮";
        case "nl":
            return "🇳🇱";
        case "no":
            return "🇳🇴";
        case "pl":
            return "🇵🇱";
        case "pt":
            return "🇵🇹";
        case "ro":
            return "🇷🇴";
        case "se":
            return "🇸🇪";
        case "ch":
            return "🇨🇭";
        case "es":
            return "🇪🇸";
        case "at":
            return "🇦🇹";
        case "gr":
            return "🇬🇷";
        case "cz":
            return "🇨🇿";
        case "cy":
            return "🇨🇾";
        case "ee":
            return "🇪🇪";
        default:
            return "🏳️";
    }
}