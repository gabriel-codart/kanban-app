'use client';

import React, { useState } from 'react';
import { X } from 'lucide-react';

interface Field {
  name: string;
  label: string;
  placeholder?: string;
  type?: 'text' | 'textarea';
  required?: boolean;
}

interface ActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Record<string, string>) => void;
  title: string;
  description?: string;
  fields: Field[];
  submitText?: string;
  variant?: 'default' | 'danger';
  initialValues?: Record<string, string>; // <--- Nova prop para pré-preencher
}

export function ActionModal({
  isOpen,
  onClose,
  onSubmit,
  title,
  description,
  fields,
  submitText = 'Confirmar',
  variant = 'default',
  initialValues = {}, // <--- Valor padrão como objeto vazio
}: ActionModalProps) {
  // Inicializamos o estado com o objeto de initialValues
  const [formData, setFormData] = useState<Record<string, string>>(initialValues);

  if (!isOpen) return null;

  const handleChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md p-6 bg-background/80 backdrop-blur-xl border border-border rounded-2xl shadow-2xl animate-in zoom-in-95 duration-200">
        
        {/* Botão Fechar */}
        <button
          onClick={onClose}
          type="button"
          className="absolute right-4 top-4 p-1 text-muted-foreground hover:text-foreground rounded-lg transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Cabeçalho */}
        <div className="mb-6">
          <h3 className="text-lg font-bold tracking-tight text-foreground">
            {title}
          </h3>
          {description && (
            <p className="text-sm text-muted-foreground mt-1">
              {description}
            </p>
          )}
        </div>

        {/* Formulário Dinâmico */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {fields.map((field) => (
            <div key={field.name} className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {field.label}
              </label>
              
              {field.type === 'textarea' ? (
                <textarea
                  required={field.required}
                  placeholder={field.placeholder}
                  value={formData[field.name] ?? ''}
                  onChange={(e) => handleChange(field.name, e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 rounded-lg bg-muted/30 border border-border text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-ring/50 transition-all text-sm resize-none"
                />
              ) : (
                <input
                  type="text"
                  required={field.required}
                  placeholder={field.placeholder}
                  value={formData[field.name] ?? ''}
                  onChange={(e) => handleChange(field.name, e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-muted/30 border border-border text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-ring/50 transition-all text-sm"
                />
              )}
            </div>
          ))}

          {/* Ações */}
          <div className="flex items-center justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:bg-muted/50 transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className={`px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-opacity shadow-sm cursor-pointer ${
                variant === 'danger'
                  ? 'bg-destructive text-destructive-foreground hover:opacity-90'
                  : 'bg-primary text-primary-foreground hover:opacity-90'
              }`}
            >
              {submitText}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}