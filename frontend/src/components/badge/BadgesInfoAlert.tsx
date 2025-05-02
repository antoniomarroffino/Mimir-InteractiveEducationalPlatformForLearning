import {PageInfoAlert} from "../common/PageInfoAlert";
import {FiAward} from "react-icons/fi";

export const BadgesInfoAlert = () => {
    return (<PageInfoAlert
            icon={<FiAward/>}
            title="How Badges Work"
            message="Badges are awarded for completing quizzes and challenges. The more you engage, the more you collect. Unlock achievements and showcase your success!"
            colorFrom="from-yellow-50"
            colorTo="to-orange-50"
            iconColor="text-yellow-600"
        />
    );
};
