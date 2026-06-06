<?php

namespace App\Traits;

trait Translatable
{
    /**
     * Fields that have an Arabic translation counterpart (suffix `_ar`).
     * Override in the model if needed.
     */
    public function translatableFields(): array
    {
        return ['name', 'description'];
    }

    /**
     * Apply a locale to the model: replace base fields with their `_ar` value
     * when locale is `ar` and the translation is present.
     */
    public function applyLocale(string $locale): self
    {
        if ($locale === 'ar') {
            foreach ($this->translatableFields() as $field) {
                $arField = $field . '_ar';
                if (!empty($this->{$arField})) {
                    $this->{$field} = $this->{$arField};
                }
            }
        }
        return $this;
    }
}
