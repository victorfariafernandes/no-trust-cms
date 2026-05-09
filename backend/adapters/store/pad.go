package store

import "sync"

type PadStore interface {
	Get(slug string) (content string, ok bool)
	Set(slug, content string)
}

type MemoryPadStore struct {
	mu   sync.RWMutex
	pads map[string]string
}

func NewMemoryPadStore() *MemoryPadStore {
	return &MemoryPadStore{pads: make(map[string]string)}
}

func (s *MemoryPadStore) Get(slug string) (string, bool) {
	s.mu.RLock()
	content, ok := s.pads[slug]
	s.mu.RUnlock()
	return content, ok
}

func (s *MemoryPadStore) Set(slug, content string) {
	s.mu.Lock()
	s.pads[slug] = content
	s.mu.Unlock()
}
