package ch.supsi.config;

import ch.supsi.model.api.question.MultipleChoiceQuestion;
import ch.supsi.model.api.question.Question;
import ch.supsi.model.api.question.TrueFalseQuestion;
import com.mongodb.MongoClientSettings;
import io.quarkus.mongodb.runtime.MongoClientCustomizer;
import jakarta.enterprise.context.ApplicationScoped;
import org.bson.codecs.configuration.CodecRegistries;
import org.bson.codecs.configuration.CodecRegistry;
import org.bson.codecs.pojo.PojoCodecProvider;

@ApplicationScoped
public class MongoCodecConfig implements MongoClientCustomizer {

    @Override
    public MongoClientSettings.Builder customize(MongoClientSettings.Builder mongoClientSettingsBuilder) {
        CodecRegistry pojoCodecRegistry = CodecRegistries.fromProviders(
                PojoCodecProvider.builder()
                        .register("ch.supsi.model.api")
                        .register(Question.class, TrueFalseQuestion.class, MultipleChoiceQuestion.class)
                        .automatic(true)
                        .build()
        );

        return mongoClientSettingsBuilder.codecRegistry(
                CodecRegistries.fromRegistries(
                        MongoClientSettings.getDefaultCodecRegistry(),
                        pojoCodecRegistry
                )
        );
    }
}