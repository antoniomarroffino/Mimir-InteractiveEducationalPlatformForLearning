import React from "react";
import {BsPatchQuestion} from "react-icons/bs";
import { FaPowerOff } from "react-icons/fa";
import { QuizPublicationDTO } from "@dti-isin/backend-api-client";
import { format } from "date-fns";
import { useGetCourseById } from "../../hooks/course/useGetCourseById.ts";
import { useGetFolderById } from "../../hooks/folder/useGetFolderById.ts";
import { useGetQuizById } from "../../hooks/quiz/useGetQuizById.ts";
import { BreadcrumbPublication } from "./BreadcrumbPublication.tsx";

interface QuizPublicationHeaderProps {
    publication: QuizPublicationDTO;
    onDeactivate: () => void;
    isDeactivating: boolean;
    onOpenConfirmModal: () => void;
}

export const QuizPublicationHeader: React.FC<QuizPublicationHeaderProps> = ({
                                                                                publication,
                                                                                isDeactivating,
                                                                                onOpenConfirmModal,
                                                                            }) => {
    const courseId = publication.courseId!;
    const folderId = publication.folderId!;
    const quizId = publication.quizId!;

    const { data: course } = useGetCourseById(courseId);
    const { data: folder } = useGetFolderById(courseId, folderId);
    const { data: quiz } = useGetQuizById(courseId, folderId, quizId);

    return (
        <header className="space-y-2 mb-4">
            <div className="bg-gradient-to-tr from-primary/5 to-base-100 border border-primary/10 p-4 sm:p-6 rounded-2xl shadow-md transition-all duration-300 hover:shadow-xl">
                <BreadcrumbPublication course={course} folder={folder} quiz={quiz} />

                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 lg:gap-6 mt-4">
                    <div className="flex-1 flex items-start gap-3 sm:gap-4">
                        <div className="p-2 sm:p-3 rounded-full bg-primary/10 text-primary shrink-0">
                            <BsPatchQuestion className="w-5 h-5 sm:w-6 sm:h-6 animate-pulse" />
                        </div>

                        <div className="flex-1 min-w-0 space-y-2">
                            <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                                <h1 className="text-2xl sm:text-3xl font-extrabold text-primary truncate">
                                    {quiz?.name || "Untitled Quiz"}
                                </h1>
                            </div>

                            <p className="text-sm text-start text-base-content/60 italic">
                                Published on {format(new Date(publication.createdAt!), "dd MMM yyyy HH:mm")}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={onOpenConfirmModal}
                            className="btn btn-sm btn-error gap-2"
                            disabled={isDeactivating}
                        >
                            {isDeactivating ? (
                                <span className="loading loading-spinner loading-sm"></span>
                            ) : (
                                <FaPowerOff />
                            )}
                            Deactivate
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
};
