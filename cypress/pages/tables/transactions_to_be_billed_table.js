import BaseTable from './base_table'

class TransactionsToBeBilledTable extends BaseTable {
  static categorySelect (rowNumber) {
    return cy.get(`.table-responsive > tbody > tr:nth-child(${rowNumber + 1}) input.tcm-select-input`)
  }

  static cell (rowNumber, columnName, regimeSlug) {
    const column = this.columnPicker(columnName, regimeSlug)

    return cy.get(`.table-responsive tr:nth-child(${rowNumber + 1}) td:nth-child(${column.index})`)
  }

  static cells (columnName, regimeSlug) {
    const column = this.columnPicker(columnName, regimeSlug)

    return cy.get(`.table-responsive tr td:nth-child(${column.index})`)
  }

  static showDetailsButton (rowNumber) {
    return cy.get(`.table-responsive tr:nth-child(${rowNumber + 1}) button.show-details-button`)
  }

  static temporaryCessationSelect (rowNumber) {
    return cy.get(`.table-responsive tr:nth-child(${rowNumber + 1}) select.temporary-cessation-select`)
  }

  // support

  static columns (regimeSlug) {
    const sharedColumns = {
      Customer: { name: 'customer_reference', index: 4 },
      'File Date': { name: 'file_date', index: 3 },
      'File Reference': { name: 'file_reference', index: 2 }
    }

    const regimeColumns = {
      pas: {
        Band: { name: 'compliance_band', index: 9 },
        Category: { name: 'sroc_category', index: 7 },
        'Original Permit': { name: 'original_permit_reference', index: 6 },
        Period: { name: 'period', index: 11 },
        Permit: { name: 'permit_reference', index: 5 }
      },
      cfd: {
        Category: { name: 'sroc_category', index: 8 },
        Consent: { name: 'consent_reference', index: 5 },
        Period: { name: 'period', index: 12 },
        '%': { name: 'variation', index: 10 }
      },
      wml: {
        Band: { name: 'compliance_band', index: 8 },
        Category: { name: 'sroc_category', index: 6 },
        Period: { name: 'period', index: 10 },
        Permit: { name: 'permit_reference', index: 5 }
      }
    }

    return {
      ...sharedColumns,
      ...regimeColumns[regimeSlug]
    }
  }

  static columnPicker (columnName, regimeSlug) {
    const regimeColumns = this.columns(regimeSlug)

    if (columnName in regimeColumns) {
      return regimeColumns[columnName]
    }

    throw new Error(`Column '${columnName}' is unknown for ${regimeSlug}. Check your spelling and case!`)
  }
}

export default TransactionsToBeBilledTable
