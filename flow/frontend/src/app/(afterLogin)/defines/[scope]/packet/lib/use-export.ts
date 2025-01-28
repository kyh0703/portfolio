import type { DefinePacket } from '@/models/define'
import ExcelJS from 'exceljs'

const bgGray: ExcelJS.FillPattern = {
  type: 'pattern',
  pattern: 'solid',
  fgColor: { argb: 'C0C0C0' },
}

const alignMiddleCenter: Partial<ExcelJS.Alignment> = {
  vertical: 'middle',
  horizontal: 'center',
}

const borderAll: Partial<ExcelJS.Borders> = {
  top: { style: 'thin' },
  bottom: { style: 'thin' },
  left: { style: 'thin' },
  right: { style: 'thin' },
}

export default function useExport() {
  const range = (start: string, end: string) => {
    const startCode = start.charCodeAt(0)
    const endCode = end.charCodeAt(0)
    return Array.from({ length: endCode - startCode + 1 }, (_, i) =>
      String.fromCharCode(startCode + i),
    )
  }

  const mergeCells = (workSheet: ExcelJS.Worksheet, ranges: string[]) => {
    ranges.forEach((range) => {
      workSheet.mergeCells(range)
    })
  }

  const setBorders = (
    workSheet: ExcelJS.Worksheet,
    rows: number[],
    cols: string[],
  ) => {
    rows.forEach((row) => {
      cols.forEach((col) => {
        workSheet.getCell(`${col}${row}`).border = {
          top: { style: 'thin' },
          bottom: { style: 'thin' },
          left: { style: 'thin' },
          right: { style: 'thin' },
        }
      })
    })
  }

  const setFill = (
    workSheet: ExcelJS.Worksheet,
    targets: string[],
    fill: ExcelJS.Fill,
  ) => {
    targets.forEach((target) => {
      workSheet.getCell(target).fill = fill
    })
  }

  const setAlignments = (
    workSheet: ExcelJS.Worksheet,
    rows: number[],
    cols: string[],
    alignment: Partial<ExcelJS.Alignment>,
  ) => {
    rows.forEach((row) => {
      cols.forEach((col) => {
        workSheet.getCell(`${col}${row}`).alignment = alignment
      })
    })
  }

  const themeTitle = (workSheet: ExcelJS.Worksheet) => {
    workSheet.getCell('A4').font = {
      size: 14,
      color: { argb: 'FFFFFF' },
    }
    workSheet.getCell('A4').alignment = alignMiddleCenter
    workSheet.getCell('A4').fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: '003366' },
    }
    workSheet.mergeCells('A4:O5')
  }

  const themeHeaders = (workSheet: ExcelJS.Worksheet) => {
    const headers = [7, 8, 9]
    headers.forEach((row) => {
      mergeCells(workSheet, [
        `A${row}:B${row}`,
        `C${row}:F${row}`,
        `G${row}:H${row}`,
        `I${row}:O${row}`,
      ])
    })
    setFill(workSheet, ['A7', 'A8', 'A9', 'G7', 'G8', 'G9'], bgGray)
    setBorders(workSheet, headers, ['A', 'C', 'G', 'I'])
    setAlignments(workSheet, headers, ['A', 'G'], alignMiddleCenter)

    workSheet.getCell('A7').value = '전문아이디'
    workSheet.getCell('A9').value = 'ARS_Service Code'
    workSheet.getCell('G7').value = '전문명'
    workSheet.getCell('G8').value = 'Direction'
    workSheet.getCell('G9').value = 'Define ID'
  }

  const themeSubTitle = (workSheet: ExcelJS.Worksheet) => {
    workSheet.mergeCells('A10:O10')
    workSheet.getCell('A10').fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFFF00' },
    }
    workSheet.getCell(`A10`).border = borderAll
    workSheet.getCell(`A10`).alignment = alignMiddleCenter
    workSheet.getCell('A10').value = '필 드 상 세'
  }

  const themeRowHeaders = (workSheet: ExcelJS.Worksheet) => {
    for (const col of range('A', 'O')) {
      workSheet.getCell(`${col}11`).fill = bgGray
      workSheet.getCell(`${col}11`).border = borderAll
      workSheet.getCell(`${col}11`).alignment = {
        vertical: 'middle',
        horizontal: 'center',
        wrapText: true,
      }
      workSheet.getCell(`${col}11`).font = {
        size: 10,
        bold: true,
      }
    }
    workSheet.getCell('A11').value = '일련번호'
    workSheet.getCell('B11').value = '필드 명\n(한글)'
    workSheet.getCell('C11').value = '필드 명\n(영문)'
    workSheet.getCell('D11').value = '데이터\nType'
    workSheet.getCell('E11').value = '위치값offset'
    workSheet.getCell('F11').value = '길이'
    workSheet.getCell('G11').value = 'INPUT'
    workSheet.getCell('H11').value = 'OUTPUT'
    workSheet.getCell('I11').value = 'Default'
    workSheet.getCell('J11').value = 'Encrypt'
    workSheet.getCell('K11').value = 'Pattern'
    workSheet.getCell('L11').value = 'Trim'
    workSheet.getCell('M11').value = 'Encode'
    workSheet.getCell('N11').value = 'Response Code'
    workSheet.getCell('O11').value = '비고'
  }

  const applyThemeStyle = (workSheet: ExcelJS.Worksheet) => {
    workSheet.getColumn('A').width = 4.63
    workSheet.getColumn('B').width = 20
    workSheet.getColumn('C').width = 20
    workSheet.getColumn('D').width = 6.5
    workSheet.getColumn('E').width = 7.13
    workSheet.getColumn('F').width = 4.63
    workSheet.getColumn('G').width = 5.88
    workSheet.getColumn('H').width = 10.25
    workSheet.getColumn('I').width = 8
    workSheet.getColumn('J').width = 8
    workSheet.getColumn('K').width = 16
    workSheet.getColumn('L').width = 4.63
    workSheet.getColumn('M').width = 8
    workSheet.getColumn('N').width = 10
    workSheet.getColumn('O').width = 31.63
    workSheet.mergeCells('A2:B2')
    workSheet.getCell('A2').value = '목차'
    themeTitle(workSheet)
    themeHeaders(workSheet)
    themeSubTitle(workSheet)
    themeRowHeaders(workSheet)
  }

  const exportSendPart = (
    workbook: ExcelJS.Workbook,
    data: DefinePacket,
    common?: DefinePacket,
  ) => {
    if (!data.sndPart) {
      return
    }

    const title = `${data.id} 요청`
    const workSheet = workbook.addWorksheet(`01_${title}`)
    applyThemeStyle(workSheet)

    workSheet.getCell('A4').value = title
    if (common) {
      workSheet.getCell('C7').value = 'Common'
    }
    workSheet.getCell('I8').value = 'Send'

    let offset = 0
    data.sndPart.forEach((part, index) => {
      const row = 12 + index
      workSheet.getCell(`A${row}`).value = index + 1
      workSheet.getCell(`B${row}`).value = part.desc
      workSheet.getCell(`C${row}`).value = part.name
      workSheet.getCell(`D${row}`).value = part.type
      workSheet.getCell(`E${row}`).value = offset
      workSheet.getCell(`F${row}`).value = part.length
      workSheet.getCell(`G${row}`).value = ''
      workSheet.getCell(`H${row}`).value = ''
      workSheet.getCell(`I${row}`).value = part.default
      workSheet.getCell(`J${row}`).value = part.encrypt
      workSheet.getCell(`K${row}`).value = part.pattern
      workSheet.getCell(`L${row}`).value = part.trim
      workSheet.getCell(`M${row}`).value = part.encode
      workSheet.getCell(`N${row}`).value = part.respCode
      workSheet.getCell(`O${row}`).value = ''
    })
  }

  const exportReceivePart = (
    workbook: ExcelJS.Workbook,
    data: DefinePacket,
    common?: DefinePacket,
  ) => {
    if (!data.rcvPart) {
      return
    }

    const title = `${data.id} 요청`
    const workSheet = workbook.addWorksheet(`02_${title}`)
    applyThemeStyle(workSheet)

    workSheet.getCell('A4').value = title
    if (common) {
      workSheet.getCell('C7').value = 'Common'
    }
    workSheet.getCell('I8').value = 'Receive'

    let offset = 0
    data.rcvPart.forEach((part, index) => {
      const row = 12 + index
      workSheet.getCell(`A${row}`).value = index + 1
      workSheet.getCell(`B${row}`).value = part.desc
      workSheet.getCell(`C${row}`).value = part.name
      workSheet.getCell(`D${row}`).value = part.type
      workSheet.getCell(`E${row}`).value = offset
      workSheet.getCell(`F${row}`).value = part.length
      workSheet.getCell(`G${row}`).value = ''
      workSheet.getCell(`H${row}`).value = ''
      workSheet.getCell(`I${row}`).value = part.default
      workSheet.getCell(`J${row}`).value = part.encrypt
      workSheet.getCell(`K${row}`).value = part.pattern
      workSheet.getCell(`L${row}`).value = part.trim
      workSheet.getCell(`M${row}`).value = part.encode
      workSheet.getCell(`N${row}`).value = part.respCode
      workSheet.getCell(`O${row}`).value = ''
    })
  }

  const save = (workbook: ExcelJS.Workbook, fileName: string) => {
    workbook.xlsx.writeBuffer().then((buffer) => {
      const blob = new Blob([buffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = fileName
      a.click()
      a.remove()
    })
  }

  const exportExcel = (data: DefinePacket, common: DefinePacket) => {
    const workbook = new ExcelJS.Workbook()
    exportSendPart(workbook, data)
    exportReceivePart(workbook, data)
    save(workbook, 'test')
  }

  return { exportExcel }
}
