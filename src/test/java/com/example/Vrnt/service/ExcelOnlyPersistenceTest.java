package com.example.Vrnt.service;

import com.example.Vrnt.model.User;
import org.junit.jupiter.api.Test;

import java.lang.annotation.Annotation;

import static org.assertj.core.api.Assertions.assertThat;

class ExcelOnlyPersistenceTest {

    @Test
    void userModelShouldNotUseJpaAnnotations() {
        Annotation[] annotations = User.class.getAnnotations();
        assertThat(annotations).isEmpty();
    }

    @Test
    void repositoryShouldNotExist() throws Exception {
        ClassLoader classLoader = Thread.currentThread().getContextClassLoader();
        assertThat(classLoader.getResource("com/example/Vrnt/Repository/UserRepository.class")).isNull();
    }
}
