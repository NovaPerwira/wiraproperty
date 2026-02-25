/**
 * Lightweight i18n for the Hotel Management System.
 * Usage:  const { t, setLocale, locale } = useI18n();
 *         t('dashboard.occupancy_rate')
 */

export type Locale = 'en' | 'id';

const translations: Record<Locale, Record<string, string>> = {
    en: {
        // Navigation
        'nav.dashboard': 'Dashboard',
        'nav.bookings': 'Bookings',
        'nav.rooms': 'Rooms',
        'nav.calendar': 'Calendar',
        'nav.guests': 'Guest Database',
        'nav.payments': 'Payments',
        'nav.housekeeping': 'Housekeeping',
        'nav.users': 'User Management',

        // Dashboard header
        'dashboard.title': 'Hotel Performance Intelligence',
        'dashboard.subtitle': 'Real-time analytics',
        'dashboard.data_for': 'Data for',

        // Section titles
        'section.business': 'Business Performance',
        'section.ops': 'Operational Snapshot — Today',
        'section.insights': 'Performance Insights — Auto-Generated',
        'section.charts': 'Trends',
        'section.channel': 'Revenue by Channel',
        'section.cancel': 'Cancellation Analysis',
        'section.recent': 'Recent Bookings',

        // KPI labels
        'kpi.occupancy': 'Occupancy Rate',
        'kpi.revenue': 'Monthly Revenue',
        'kpi.arr': 'ARR — Avg Room Rate',
        'kpi.revpar': 'RevPAR',
        'kpi.arr_sub': 'Revenue per sold room',
        'kpi.revpar_sub': 'Revenue per available room',

        // Ops labels
        'ops.total_rooms': 'Total Rooms',
        'ops.available': 'Available',
        'ops.occupied': 'Occupied Today',
        'ops.maintenance': 'Maintenance',
        'ops.pending': 'Pending Bookings',

        // Chart toggles
        'chart.revenue': 'Revenue',
        'chart.occupancy': 'Occupancy',
        'chart.cancellation': 'Cancellation',
        'chart.revenue_title': 'Revenue Trend',
        'chart.occ_title': 'Occupancy Rate Trend',
        'chart.cancel_title': 'Cancellation Rate Trend',
        'chart.weekly': 'Last {n} weeks',
        'chart.period_weeks': '{n}W',

        // Delta
        'delta.vs_lm': 'vs LM',

        // Channel table
        'channel.source': 'Channel',
        'channel.revenue': 'Revenue',
        'channel.rev_pct': 'Rev %',
        'channel.bookings': 'Bookings',
        'channel.commission': 'Commission',
        'channel.net': 'Net Revenue (after OTA commission)',
        'channel.rate': 'OTA commission at',

        // Commission summary
        'commission.gross': 'Gross Revenue',
        'commission.ota_rev': 'OTA Revenue',
        'commission.fee': 'OTA Commission',
        'commission.net': 'Net Revenue',

        // Cancellation
        'cancel.rate': 'Cancellation Rate',
        'cancel.last6': 'Last 6 months',
        'cancel.of': 'cancelled of',
        'cancel.bookings': 'bookings',
        'cancel.by_channel': 'By Channel',
        'cancel.insight_high': 'Very high cancellation rate. Apply non-refundable rates or mandatory deposit.',
        'cancel.insight_mid': 'Moderate cancellation rate. Monitor which channel contributes the most.',
        'cancel.insight_ok': 'Healthy cancellation rate — booking policies are effective.',

        // Recent bookings table
        'table.guest': 'Guest',
        'table.room': 'Room',
        'table.checkin': 'Check-in',
        'table.nights': 'Nights',
        'table.amount': 'Amount',
        'table.source': 'Source',
        'table.status': 'Status',
        'table.no_data': 'No bookings yet.',
        'table.view_all': 'View all →',
        'table.per_page': 'Rows per page',
        'table.page': 'Page',
        'table.of': 'of',

        // Insights
        'insight.occ_low_title': 'Low Occupancy',
        'insight.occ_low_msg': 'Occupancy rate {v}% — below 40% threshold. Consider promotions or bundling to drive demand.',
        'insight.occ_high_title': 'High Occupancy',
        'insight.occ_high_msg': 'Occupancy rate {v}% — almost full! Consider dynamic pricing to maximize RevPAR.',
        'insight.ota_dep_title': 'High OTA Dependency',
        'insight.ota_dep_msg': 'OTA {v}% of all bookings. Estimated commission this month: Rp {c} (annualized ~Rp {a}). Direct booking investment can increase margins significantly.',
        'insight.direct_title': 'Dominant Direct Channel',
        'insight.direct_msg': '{v}% bookings via direct/walk-in — higher margins without OTA commissions.',
        'insight.rev_drop_title': 'Significant Revenue Drop',
        'insight.rev_drop_msg': 'Revenue down {v}% vs last month. Check for seasonality or ARR changes.',
        'insight.rev_grow_title': 'Strong Revenue Growth',
        'insight.rev_grow_msg': 'Revenue up {v}% vs last month — above average.',
        'insight.cancel_high_title': 'High Cancellation Rate',
        'insight.cancel_high_msg': 'Cancellation rate {v}% — exceeds 20% threshold. Consider non-refundable rates.',
        'insight.cancel_mid_title': 'Monitor Cancellation Rate',
        'insight.cancel_mid_msg': 'Cancellation rate {v}% — needs attention. Monitor which channel contributes most.',
        'insight.arr_drop_title': 'Lower Average Room Rate',
        'insight.arr_drop_msg': 'ARR down {v}% — potential over-discounting. Evaluate pricing strategy.',
        'insight.normal_title': 'Normal Performance',
        'insight.normal_msg': 'All business metrics are within normal limits. No urgent actions required.',

        // Misc
        'misc.loading': 'Loading…',
        'misc.night_abbr': 'N',
    },

    id: {
        // ... (id keys)
        // Navigation
        'nav.dashboard': 'Dashboard',
        'nav.bookings': 'Booking',
        'nav.rooms': 'Kamar',
        'nav.calendar': 'Kalender',
        'nav.guests': 'Database Tamu',
        'nav.payments': 'Pembayaran',
        'nav.housekeeping': 'Housekeeping',
        'nav.users': 'Manajemen Pengguna',

        // Dashboard header
        'dashboard.title': 'Hotel Performance Intelligence',
        'dashboard.subtitle': 'Analitik real-time',
        'dashboard.data_for': 'Data bulan',

        // Section titles
        'section.business': 'Performa Bisnis',
        'section.ops': 'Snapshot Operasional — Hari Ini',
        'section.insights': 'Insight Performa — Auto-Generated',
        'section.charts': 'Tren',
        'section.channel': 'Revenue per Saluran',
        'section.cancel': 'Analisis Pembatalan',
        'section.recent': 'Booking Terbaru',

        // KPI labels
        'kpi.occupancy': 'Tingkat Hunian',
        'kpi.revenue': 'Revenue Bulanan',
        'kpi.arr': 'ARR — Rata-rata Tarif Kamar',
        'kpi.revpar': 'RevPAR',
        'kpi.arr_sub': 'Revenue per kamar terjual',
        'kpi.revpar_sub': 'Revenue per kamar tersedia',

        // Ops labels
        'ops.total_rooms': 'Total Kamar',
        'ops.available': 'Tersedia',
        'ops.occupied': 'Terisi Hari Ini',
        'ops.maintenance': 'Maintenance',
        'ops.pending': 'Booking Pending',

        // Chart toggles
        'chart.revenue': 'Revenue',
        'chart.occupancy': 'Hunian',
        'chart.cancellation': 'Pembatalan',
        'chart.revenue_title': 'Tren Revenue',
        'chart.occ_title': 'Tren Tingkat Hunian',
        'chart.cancel_title': 'Tren Pembatalan',
        'chart.weekly': '{n} minggu terakhir',
        'chart.period_weeks': '{n}M',

        // Delta
        'delta.vs_lm': 'vs BL',

        // Channel table
        'channel.source': 'Saluran',
        'channel.revenue': 'Revenue',
        'channel.rev_pct': 'Rev %',
        'channel.bookings': 'Booking',
        'channel.commission': 'Komisi',
        'channel.net': 'Net Revenue (setelah komisi OTA)',
        'channel.rate': 'Komisi OTA sebesar',

        // Commission summary
        'commission.gross': 'Gross Revenue',
        'commission.ota_rev': 'Revenue OTA',
        'commission.fee': 'Komisi OTA',
        'commission.net': 'Net Revenue',

        // Cancellation
        'cancel.rate': 'Tingkat Pembatalan',
        'cancel.last6': '6 bulan terakhir',
        'cancel.of': 'dibatalkan dari',
        'cancel.bookings': 'booking',
        'cancel.by_channel': 'Per Saluran',
        'cancel.insight_high': '⛔ Cancellation rate sangat tinggi. Terapkan non-refundable rate atau deposit wajib.',
        'cancel.insight_mid': '⚠️ Cancellation rate moderat. Pantau channel mana yang berkontribusi terbesar.',
        'cancel.insight_ok': '✅ Cancellation rate sehat — kebijakan booking efektif.',

        // Recent bookings table
        'table.guest': 'Tamu',
        'table.room': 'Kamar',
        'table.checkin': 'Check-in',
        'table.nights': 'Malam',
        'table.amount': 'Nominal',
        'table.source': 'Sumber',
        'table.status': 'Status',
        'table.no_data': 'Belum ada booking.',
        'table.view_all': 'Lihat semua →',
        'table.per_page': 'Baris per halaman',
        'table.page': 'Halaman',
        'table.of': 'dari',

        // Insignths
        'insight.occ_low_title': 'Hunian Rendah',
        'insight.occ_low_msg': 'Tingkat hunian {v}% — di bawah ambang 40%. Pertimbangkan promosi atau paket bundling untuk meningkatkan permintaan.',
        'insight.occ_high_title': 'Hunian Tinggi',
        'insight.occ_high_msg': 'Tingkat hunian {v}% — hampir penuh! Pertimbangkan dynamic pricing untuk memaksimalkan RevPAR.',
        'insight.ota_dep_title': 'Ketergantungan OTA Tinggi',
        'insight.ota_dep_msg': 'OTA {v}% dari total booking. Estimasi komisi bulan ini: Rp {c} (annualized ~Rp {a}). Investasi pada booking langsung dapat meningkatkan margin secara signifikan.',
        'insight.direct_title': 'Channel Direct Dominan',
        'insight.direct_msg': '{v}% booking melalui direct/walk-in — margin lebih tinggi tanpa komisi OTA.',
        'insight.rev_drop_title': 'Penurunan Revenue Signifikan',
        'insight.rev_drop_msg': 'Revenue turun {v}% vs bulan lalu. Periksa faktor musim atau perubahan tarif kamar.',
        'insight.rev_grow_title': 'Pertumbuhan Revenue Kuat',
        'insight.rev_grow_msg': 'Revenue naik {v}% vs bulan lalu — di atas rata-rata.',
        'insight.cancel_high_title': 'Tingkat Pembatalan Tinggi',
        'insight.cancel_high_msg': 'Tingkat pembatalan {v}% — melebihi ambang 20%. Pertimbangkan kebijakan non-refundable.',
        'insight.cancel_mid_title': 'Pantau Tingkat Pembatalan',
        'insight.cancel_mid_msg': 'Tingkat pembatalan {v}% — perlu diperhatikan. Pantau saluran mana yang memiliki pembatalan tertinggi.',
        'insight.arr_drop_title': 'Tarif Kamar Menurun',
        'insight.arr_drop_msg': 'ARR turun {v}% — potensi diskon berlebihan. Evaluasi strategi penetapan harga.',
        'insight.normal_title': 'Performa Normal',
        'insight.normal_msg': 'Semua metrik bisnis berada dalam batas normal. Tidak ada tindakan mendesak yang diperlukan.',

        // Misc
        'misc.loading': 'Memuat…',
        'misc.night_abbr': 'M',
    },
};

/** Simple key lookup with optional param interpolation: t('chart.weekly', { n: 8 }) */
export function translate(locale: Locale, key: string, params?: Record<string, string | number>): string {
    let str = translations[locale][key] ?? translations['en'][key] ?? key;
    if (params) {
        Object.entries(params).forEach(([k, v]) => {
            str = str.replace(`{${k}}`, String(v));
        });
    }
    return str;
}

/** Store locale in localStorage so it persists across navigation */
export function getStoredLocale(): Locale {
    if (typeof window === 'undefined') return 'en';
    return (localStorage.getItem('hms_locale') as Locale) ?? 'en';
}

export function setStoredLocale(l: Locale) {
    localStorage.setItem('hms_locale', l);
}
