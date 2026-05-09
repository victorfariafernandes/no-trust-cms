package httpadapter

import (
	"encoding/json"
	"errors"
	"log"
	"net/http"
	"strings"

	padsvc "no-trust-cms-backend/services/pad"
)

type PadHandler struct {
	svc *padsvc.Service
}

func NewPadHandler(svc *padsvc.Service) *PadHandler {
	return &PadHandler{svc: svc}
}

func (h *PadHandler) Register(
	mux *http.ServeMux,
	cors func(http.HandlerFunc) http.HandlerFunc,
	rateLimit func(http.HandlerFunc) http.HandlerFunc,
) {
	mux.HandleFunc("/pads/", cors(func(w http.ResponseWriter, r *http.Request) {
		switch r.Method {
		case http.MethodGet:
			h.HandleGet(w, r)
		case http.MethodPut:
			rateLimit(h.HandleSet)(w, r)
		default:
			writeJSON(w, http.StatusMethodNotAllowed, map[string]string{"error": "method not allowed"})
		}
	}))
}

func (h *PadHandler) HandleGet(w http.ResponseWriter, r *http.Request) {
	slug := slugFrom(r)
	if slug == "" {
		writeJSON(w, http.StatusBadRequest, map[string]string{"error": "missing slug"})
		return
	}
	content, err := h.svc.Get(slug)
	if errors.Is(err, padsvc.ErrNotFound) {
		writeJSON(w, http.StatusNotFound, map[string]string{"error": "pad not found"})
		return
	}
	writeJSON(w, http.StatusOK, map[string]string{"slug": slug, "content": content})
}

func (h *PadHandler) HandleSet(w http.ResponseWriter, r *http.Request) {
	slug := slugFrom(r)
	if slug == "" {
		writeJSON(w, http.StatusBadRequest, map[string]string{"error": "missing slug"})
		return
	}
	var body struct {
		Content string `json:"content"`
	}
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		writeJSON(w, http.StatusBadRequest, map[string]string{"error": "invalid body"})
		return
	}
	if err := h.svc.Set(slug, body.Content); err != nil {
		log.Printf("Set pad %q: %v", slug, err)
		writeJSON(w, http.StatusInternalServerError, map[string]string{"error": "internal error"})
		return
	}
	writeJSON(w, http.StatusOK, map[string]string{"slug": slug, "content": body.Content})
}

func slugFrom(r *http.Request) string {
	slug := strings.TrimPrefix(r.URL.Path, "/pads/")
	if slug == "" || strings.Contains(slug, "/") {
		return ""
	}
	return slug
}
