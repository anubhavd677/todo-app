package com.todo.backend.service;

import com.todo.backend.model.Todo;
import com.todo.backend.repository.TodoRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TodoService {

    private final TodoRepository repository;

    public TodoService(TodoRepository repository) {
        this.repository = repository;
    }

    public List<Todo> findAll() {
        return repository.findAll();
    }

    public Todo create(Todo todo) {
        todo.setId(null);
        return repository.save(todo);
    }

    public Optional<Todo> findById(Long id) {
        return repository.findById(id);
    }

    public Todo update(Long id, Todo updatedTodo) {
        return repository.findById(id)
                .map(existing -> {
                    existing.setTitle(updatedTodo.getTitle());
                    existing.setCompleted(updatedTodo.getCompleted());
                    return repository.save(existing);
                })
                .orElse(null);
    }

    public boolean delete(Long id) {
        if (!repository.existsById(id)) {
            return false;
        }
        repository.deleteById(id);
        return true;
    }
}
