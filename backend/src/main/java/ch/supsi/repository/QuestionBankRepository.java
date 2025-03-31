package ch.supsi.repository;


import ch.supsi.model.api.QuestionBank;
import io.quarkus.mongodb.panache.PanacheMongoRepository;
import jakarta.enterprise.context.ApplicationScoped;
import org.bson.types.ObjectId;

import java.util.Optional;

@ApplicationScoped
public class QuestionBankRepository implements PanacheMongoRepository<QuestionBank> {
    public Optional<QuestionBank> findByNameOptional(String name) {
        return find("{'name': ?1}", name).firstResultOptional();
    }

    public void addQuestionToQuestionBank(String questionId, ObjectId questionBankId) {
        update("{$addToSet: {questions: ?1}}", questionId).where("_id", questionBankId);
    }

    public void removeQuestionFromQuestionBank(String questionId, ObjectId questionBankId) {
        update("{$pull: {questions: ?1}}", questionId).where("_id", questionBankId);
    }
}
