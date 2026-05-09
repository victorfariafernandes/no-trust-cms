package pad

import (
	"errors"

	"no-trust-cms-backend/adapters/store"
)

var ErrNotFound = errors.New("pad not found")

type Service struct {
	pads store.PadStore
}

func New(pads store.PadStore) *Service {
	return &Service{pads: pads}
}

func (s *Service) Get(slug string) (string, error) {
	content, ok := s.pads.Get(slug)
	if !ok {
		return "", ErrNotFound
	}
	return content, nil
}

func (s *Service) Set(slug, content string) error {
	s.pads.Set(slug, content)
	return nil
}
