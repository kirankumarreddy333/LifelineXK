import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import 'providers/donor_provider.dart';
import 'screens/home_screen.dart';
import 'screens/donor_list_screen.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(
    ChangeNotifierProvider(
      create: (_) => DonorProvider(),
      child: const BloodDonorApp(),
    ),
  );
}

/// GoRouter configuration for declarative routing between `/` and `/donors`
final GoRouter _router = GoRouter(
  initialLocation: '/',
  routes: [
    GoRoute(
      path: '/',
      builder: (context, state) => const HomeScreen(),
    ),
    GoRoute(
      path: '/donors',
      builder: (context, state) => const DonorListScreen(),
    ),
  ],
);

class BloodDonorApp extends StatelessWidget {
  const BloodDonorApp({super.key});

  @override
  Widget build(BuildContext context) {
    return Consumer<DonorProvider>(
      builder: (context, provider, child) {
        // Theme Colors
        const primaryRed = Color(0xFFDC2626);
        const darkText = Color(0xFF111827);
        const scaffoldBg = Color(0xFFFFF5F5);

        return MaterialApp.router(
          title: 'Blood Donor Management',
          debugShowCheckedModeBanner: false,
          routerConfig: _router,
          themeMode: provider.isDarkMode ? ThemeMode.dark : ThemeMode.light,
          theme: ThemeData(
            useMaterial3: true,
            scaffoldBackgroundColor: scaffoldBg,
            primaryColor: primaryRed,
            fontFamily: 'Arial',
            colorScheme: ColorScheme.fromSeed(
              seedColor: primaryRed,
              primary: primaryRed,
              secondary: darkText,
              background: scaffoldBg,
              surface: Colors.white,
            ),
            appBarTheme: const AppBarTheme(
              backgroundColor: primaryRed,
              foregroundColor: Colors.white,
              elevation: 0,
              centerTitle: true,
            ),
            cardTheme: CardTheme(
              color: Colors.white,
              elevation: 4,
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(15),
              ),
            ),
          ),
          darkTheme: ThemeData.dark().copyWith(
            primaryColor: primaryRed,
            scaffoldBackgroundColor: const Color(0xFF18181B),
            colorScheme: const ColorScheme.dark(
              primary: primaryRed,
              secondary: Colors.white,
              surface: Color(0xFF27272A),
            ),
            appBarTheme: const AppBarTheme(
              backgroundColor: Color(0xFF27272A),
              foregroundColor: Colors.white,
            ),
          ),
        );
      },
    );
  }
}
