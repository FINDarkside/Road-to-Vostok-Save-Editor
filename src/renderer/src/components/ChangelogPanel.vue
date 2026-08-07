<script setup lang="ts">
import { computed } from 'vue'
import { CHANGELOG } from '../data/changelog'

interface ChangelogSection {
  title: string
  items: string[]
}

interface ChangelogRelease {
  version: string
  sections: ChangelogSection[]
}

function plainText(value: string) {
  return value
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\[([^\]]+)]\([^)]+\)/g, '$1')
}

const releases = computed(() => {
  const result: ChangelogRelease[] = []
  let release: ChangelogRelease | null = null
  let section: ChangelogSection | null = null

  for (const line of CHANGELOG.split(/\r?\n/)) {
    const version = line.match(/^##\s+(.+)/)?.[1]
    if (version) {
      release = { version, sections: [] }
      result.push(release)
      section = null
      continue
    }

    const heading = line.match(/^###\s+(.+)/)?.[1]
    if (heading && release) {
      section = { title: heading, items: [] }
      release.sections.push(section)
      continue
    }

    const item = line.match(/^[-*]\s+(.+)/)?.[1]
    if (item && release) {
      if (!section) {
        section = { title: '', items: [] }
        release.sections.push(section)
      }
      section.items.push(plainText(item))
    }
  }

  return result
})
</script>

<template>
  <div class="max-w-3xl space-y-6">
    <h2 class="text-lg font-semibold">Changelog</h2>

    <section v-for="release in releases" :key="release.version" class="space-y-3">
      <h3 class="border-b border-border pb-1 text-base font-semibold">
        Version {{ release.version }}
      </h3>

      <div v-for="section in release.sections" :key="section.title" class="space-y-1.5">
        <h4 v-if="section.title" class="text-sm font-medium">{{ section.title }}</h4>
        <ul class="list-disc space-y-1 pl-5 text-sm text-muted-foreground">
          <li v-for="item in section.items" :key="item">{{ item }}</li>
        </ul>
      </div>
    </section>
  </div>
</template>
