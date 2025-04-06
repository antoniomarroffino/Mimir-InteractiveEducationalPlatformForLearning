package ch.supsi.model.api.badge;

public enum BadgeType {
    BEST_ATTEMPT("Best attempt", "trophy");

    private final String displayName;
    private final String icon;

    BadgeType(String displayName, String icon) {
        this.displayName = displayName;
        this.icon = icon;
    }

    public String getDisplayName() {
        return displayName;
    }

    public String getIcon() {
        return icon;
    }
}