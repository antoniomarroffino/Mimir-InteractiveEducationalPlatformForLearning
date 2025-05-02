package ch.supsi.config;

import ch.supsi.model.api.question.MultipleChoiceQuestion;
import ch.supsi.model.api.question.Question;
import ch.supsi.model.api.question.TrueFalseQuestion;
import ch.supsi.model.api.response.MultipleChoiceQuestionResponse;
import ch.supsi.model.api.response.QuestionResponse;
import ch.supsi.model.api.response.TrueFalseQuestionResponse;
import com.mongodb.MongoClientSettings;
import io.quarkus.mongodb.runtime.MongoClientCustomizer;
import jakarta.enterprise.context.ApplicationScoped;
import org.bson.codecs.configuration.CodecRegistries;
import org.bson.codecs.configuration.CodecRegistry;
import org.bson.codecs.pojo.PojoCodecProvider;
import org.jetbrains.annotations.NotNull;

@ApplicationScoped
public class MongoCodecConfig implements MongoClientCustomizer {
    @Override
    public MongoClientSettings.Builder customize(MongoClientSettings.@NotNull Builder mongoClientSettingsBuilder) {
        PojoCodecProvider pojoCodecProvider = PojoCodecProvider.builder()
                .register(Question.class)
                .register(TrueFalseQuestion.class)
                .register(MultipleChoiceQuestion.class)
                .register(QuestionResponse.class)
                .register(TrueFalseQuestionResponse.class)
                .register(MultipleChoiceQuestionResponse.class)
                .automatic(true)
                .build();

        CodecRegistry pojoCodecRegistry = CodecRegistries.fromRegistries(
                MongoClientSettings.getDefaultCodecRegistry(),
                CodecRegistries.fromProviders(pojoCodecProvider)
        );

        return mongoClientSettingsBuilder.codecRegistry(pojoCodecRegistry);
    }
}