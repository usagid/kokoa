<script setup lang="ts">
export interface TableColumn {
  key: string
  label: string
  width?: string
  align?: 'left' | 'center' | 'right'
  editable?: boolean
  sortable?: boolean
  filterable?: boolean
}

const props = withDefaults(defineProps<{
  columns: TableColumn[]
  rows: Record<string, any>[]
  striped?: boolean
  compact?: boolean
  bordered?: boolean
}>(), {
  striped: true,
  compact: false,
  bordered: false
})

const emit = defineEmits<{
  'update:cell': [payload: { rowIndex: number; key: string; value: string }]
}>()

const editingCell = ref<{ row: number; col: string } | null>(null)
const editValue = ref('')
const inputRef = ref<HTMLInputElement | null>(null)

const sortKey = ref<string | null>(null)
const sortDir = ref<'asc' | 'desc'>('asc')

const filters = ref<Record<string, string>>({})
const openFilter = ref<string | null>(null)
const filterInputRef = ref<HTMLInputElement | null>(null)

const activeFilterCount = computed(() =>
  Object.values(filters.value).filter(v => v.trim()).length
)

const filteredRows = computed(() => {
  let result = [...props.rows]
  for (const col of props.columns) {
    const q = filters.value[col.key]?.toLowerCase().trim()
    if (q) {
      result = result.filter(row => String(row[col.key] ?? '').toLowerCase().includes(q))
    }
  }
  return result
})

const sortedRows = computed(() => {
  const data = filteredRows.value
  if (!sortKey.value) return data
  const key = sortKey.value
  const dir = sortDir.value === 'asc' ? 1 : -1
  return [...data].sort((a, b) => {
    const va = a[key]
    const vb = b[key]
    if (va == null && vb == null) return 0
    if (va == null) return 1
    if (vb == null) return -1
    if (typeof va === 'number' && typeof vb === 'number') return (va - vb) * dir
    return String(va).localeCompare(String(vb)) * dir
  })
})

function toggleSort(col: TableColumn) {
  if (!col.sortable) return
  if (sortKey.value === col.key) {
    sortDir.value = sortDir.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortKey.value = col.key
    sortDir.value = 'asc'
  }
}

function sortIndicator(col: TableColumn) {
  if (!col.sortable) return ''
  if (sortKey.value !== col.key) return ' ⇅'
  return sortDir.value === 'asc' ? ' ▲' : ' ▼'
}

function toggleFilter(col: TableColumn, e: MouseEvent) {
  e.stopPropagation()
  if (openFilter.value === col.key) {
    openFilter.value = null
  } else {
    openFilter.value = col.key
    nextTick(() => filterInputRef.value?.focus())
  }
}

function clearFilter(key: string) {
  filters.value[key] = ''
  openFilter.value = null
}

function onFilterKeydown(e: KeyboardEvent, key: string) {
  if (e.key === 'Enter' || e.key === 'Escape') {
    e.preventDefault()
    openFilter.value = null
  }
}

function onFilterBlur() {
  setTimeout(() => { openFilter.value = null }, 120)
}

function getOriginalIndex(sortedRow: Record<string, any>) {
  return props.rows.indexOf(sortedRow)
}

function startEdit(sortedIndex: number, key: string, currentValue: any) {
  const origIdx = getOriginalIndex(sortedRows.value[sortedIndex])
  editingCell.value = { row: origIdx, col: key }
  editValue.value = String(currentValue ?? '')
  nextTick(() => {
    inputRef.value?.focus()
    inputRef.value?.select()
  })
}

function commitEdit() {
  if (editingCell.value) {
    emit('update:cell', {
      rowIndex: editingCell.value.row,
      key: editingCell.value.col,
      value: editValue.value
    })
  }
  editingCell.value = null
}

function cancelEdit() {
  editingCell.value = null
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Enter') {
    e.preventDefault()
    commitEdit()
  } else if (e.key === 'Escape') {
    e.preventDefault()
    cancelEdit()
  } else if (e.key === 'Tab') {
    e.preventDefault()
    const prevCell = editingCell.value ? { ...editingCell.value } : null
    commitEdit()
    if (!prevCell) return
    const editableCols = props.columns.filter(c => c.editable)
    if (!editableCols.length) return
    const curColIdx = props.columns.findIndex(c => c.key === prevCell.col)
    const curSortedIdx = sortedRows.value.findIndex(r => props.rows.indexOf(r) === prevCell.row)
    let nextCol = -1
    let nextSortedRow = curSortedIdx
    for (let i = curColIdx + 1; i < props.columns.length; i++) {
      if (props.columns[i].editable) { nextCol = i; break }
    }
    if (nextCol === -1) {
      nextSortedRow = curSortedIdx + 1
      if (nextSortedRow < sortedRows.value.length) {
        for (let i = 0; i < props.columns.length; i++) {
          if (props.columns[i].editable) { nextCol = i; break }
        }
      }
    }
    if (nextCol !== -1 && nextSortedRow < sortedRows.value.length) {
      nextTick(() => {
        startEdit(nextSortedRow, props.columns[nextCol].key, sortedRows.value[nextSortedRow][props.columns[nextCol].key])
      })
    }
  }
}

function isEditing(originalRowIndex: number, key: string) {
  return editingCell.value?.row === originalRowIndex && editingCell.value?.col === key
}
</script>

<template>
  <div class="kokoa-table-wrap">
    <table
      class="kokoa-table"
      :class="{
        'kokoa-table--striped': striped,
        'kokoa-table--compact': compact,
        'kokoa-table--bordered': bordered,
      }"
    >
      <thead>
        <tr>
          <th
            v-for="col in columns"
            :key="col.key"
            :style="{ width: col.width, textAlign: col.align || 'left' }"
            :class="{ 'kokoa-table__th--sortable': col.sortable }"
            @click="toggleSort(col)"
          >
            <span class="kokoa-table__th-content">
              <span>{{ col.label }}{{ sortIndicator(col) }}</span>
              <button
                v-if="col.filterable"
                type="button"
                class="kokoa-table__filter-btn"
                :class="{ 'kokoa-table__filter-btn--active': filters[col.key]?.trim() }"
                @click="toggleFilter(col, $event)"
                @mousedown.prevent
              >⊞</button>
            </span>
            <div
              v-if="openFilter === col.key"
              class="kokoa-table__filter-popover"
              @click.stop
            >
              <input
                ref="filterInputRef"
                v-model="filters[col.key]"
                class="kokoa-table__filter-input"
                placeholder="Filter…"
                @keydown="onFilterKeydown($event, col.key)"
                @blur="onFilterBlur"
              />
              <button
                v-if="filters[col.key]?.trim()"
                type="button"
                class="kokoa-table__filter-clear"
                @mousedown.prevent
                @click="clearFilter(col.key)"
              >✕</button>
            </div>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(row, sortedIdx) in sortedRows" :key="getOriginalIndex(row)">
          <td
            v-for="col in columns"
            :key="col.key"
            :style="{ textAlign: col.align || 'left' }"
            :class="{
              'kokoa-table__cell--editable': col.editable,
              'kokoa-table__cell--editing': isEditing(getOriginalIndex(row), col.key),
            }"
            @click="col.editable && !isEditing(getOriginalIndex(row), col.key) ? startEdit(sortedIdx, col.key, row[col.key]) : undefined"
          >
            <input
              v-if="isEditing(getOriginalIndex(row), col.key)"
              ref="inputRef"
              v-model="editValue"
              class="kokoa-table__cell-input"
              @blur="commitEdit"
              @keydown="onKeydown"
            />
            <slot v-else :name="`cell-${col.key}`" :row="row" :value="row[col.key]" :row-index="getOriginalIndex(row)">
              {{ row[col.key] }}
            </slot>
          </td>
        </tr>
        <tr v-if="sortedRows.length === 0">
          <td :colspan="columns.length" class="kokoa-table__empty">
            {{ activeFilterCount > 0 ? 'No matches found' : 'No data ε(´∀｀)з' }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
