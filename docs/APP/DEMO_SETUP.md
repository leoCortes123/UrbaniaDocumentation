# 🎮 DEMO_SETUP
## Configuración Demo Offline-First

> **Consultar**: Si es configuración inicial, datos de demo, o implementación de FakeRepository.
> **Relacionado con**: ARCHITECTURE.md, DEVELOPMENT_GUIDE.md, FEATURES_INDEX.md

---

## Propósito

Define cómo la app funciona en **modo demo** sin API backend, incluyendo credenciales, datos mock, persistencia local y estrategia de migración futura.

---

## 1. Credenciales de Demo por Defecto

Para facilitar el primer acceso sin registro:

```dart
// /core/domain/enums/user_role.dart
enum UserRole { admin, resident, unknown }

// /core/domain/enums/resident_status.dart  
enum ResidentStatus { active, inactive, pending }

```

```dart
// /core/demo/demo_credentials.dart
class DemoCredentials {
  static const String adminEmail = 'admin@urbania.demo';
  static const String adminPassword = 'Urbania2026!';

  static const String residentEmail = 'residente@urbania.demo';
  static const String residentPassword = 'Residente2026!';

  /// Valida credenciales demo contra la lista hardcodeada
  static bool validate(String email, String password) {
    return (email == adminEmail && password == adminPassword) ||
           (email == residentEmail && password == residentPassword);
  }

  /// Retorna el rol según credenciales
  static UserRole getRole(String email) {
    if (email == adminEmail) return UserRole.admin;
    if (email == residentEmail) return UserRole.resident;
    return UserRole.unknown;
  }

  /// Retorna nombre según credenciales
  static String getName(String email) {
    if (email == adminEmail) return 'Administrador Demo';
    if (email == residentEmail) return 'Residente Demo';
    return 'Usuario Demo';
  }

  /// Retorna unidad según credenciales
  static String getUnit(String email) {
    if (email == adminEmail) return 'Oficina Admin';
    if (email == residentEmail) return 'Apto 101';
    return 'N/A';
  }
}
```

### Seguridad (Demo Only)
- Estas credenciales son **exclusivamente para demostración local**
- En producción: eliminar `DemoCredentials` y usar autenticación real
- El JWT token demo se genera localmente con firma dummy (ver sección 3)
- No usar en builds de producción

---

## 2. Datos Mock Generados

```dart
// /core/domain/entities/property_entity.dart
class PropertyEntity {
  final String id;
  final String name;
  final String address;
  final int totalUnits;
  final String adminName;
  final String adminPhone;
  final DateTime createdAt;

  const PropertyEntity({
    required this.id,
    required this.name,
    required this.address,
    required this.totalUnits,
    required this.adminName,
    required this.adminPhone,
    required this.createdAt,
  });
}

```

```dart
// /core/demo/demo_data.dart
import 'package:faker/faker.dart';

class DemoData {
  static final _faker = Faker();

  /// Genera una propiedad horizontal demo
  static PropertyEntity get demoProperty => PropertyEntity(
    id: 'prop_demo_001',
    name: 'Conjunto Residencial Los Pinos',
    address: 'Calle 123 # 45-67, Bogotá',
    totalUnits: 48,
    adminName: 'Admin Demo',
    adminPhone: '3001234567',
    createdAt: DateTime(2024, 1, 15),
  );

  /// Genera residentes demo (8 total, pero solo 2 pueden loguear)
  static List<ResidentEntity> get demoResidents => List.generate(
    8,
    (i) => ResidentEntity(
      id: 'res_demo_${i.toString().padLeft(3, '0')}',
      name: i == 0 ? 'Administrador Demo' : 
            i == 1 ? 'Residente Demo' : 
            _faker.person.name(),
      email: i == 0 ? DemoCredentials.adminEmail :
             i == 1 ? DemoCredentials.residentEmail :
             _faker.internet.email(),
      unit: 'Apto ${101 + i}',
      phone: '3${_faker.randomGenerator.integer(999999999, min: 100000000).toString()}',
      avatarUrl: null,
      role: i == 0 ? UserRole.admin : UserRole.resident,
      status: ResidentStatus.active,
    ),
  );

  /// Genera reservas de zonas comunes demo
  static List<ReservationEntity> get demoReservations => [
    ReservationEntity(
      id: 'resv_demo_001',
      zoneName: 'Salón Social',
      residentName: demoResidents[1].name,
      date: DateTime.now().add(const Duration(days: 2)),
      startTime: '14:00',
      endTime: '18:00',
      status: ReservationStatus.confirmed,
      createdAt: DateTime.now().subtract(const Duration(days: 5)),
    ),
    ReservationEntity(
      id: 'resv_demo_002',
      zoneName: 'Piscina',
      residentName: demoResidents[2].name,
      date: DateTime.now().add(const Duration(days: 5)),
      startTime: '10:00',
      endTime: '12:00',
      status: ReservationStatus.pending,
      createdAt: DateTime.now().subtract(const Duration(days: 2)),
    ),
  ];

  /// Genera pagos/pqr/notificaciones demo
  static List<PaymentEntity> get demoPayments => [...];
  static List<PqrEntity> get demoPqrs => [...];
  static List<NotificationEntity> get demoNotifications => [...];
  static List<ChatMessageEntity> get demoChatMessages => [...];
  static List<CommonZoneEntity> get demoCommonZones => [...];
}
```

---

## 3. FakeRepository Pattern

Cada feature implementa un `FakeRepository` que simula la API:

```dart
// /auth/data/repositories/fake_auth_repository.dart
class FakeAuthRepository implements AuthRepository {
  final HiveStorage _localStorage;
  final _delay = const Duration(milliseconds: 600);

  FakeAuthRepository(this._localStorage);

  @override
  Future<Either<Failure, ResidentEntity>> login(String email, String password) async {
    await Future.delayed(_delay); // Simula latencia de red

    if (!DemoCredentials.validate(email, password)) {
      return const Left(ValidationFailure('Credenciales incorrectas'));
    }

    final user = DemoData.demoResidents.firstWhere(
      (r) => r.email == email,
      orElse: () => DemoData.demoResidents.first.copyWith(
        email: email,
        role: DemoCredentials.getRole(email),
        name: DemoCredentials.getName(email),
        unit: DemoCredentials.getUnit(email),
      ),
    );

    // Genera token JWT local con firma dummy
    final token = _generateLocalToken(user);
    await _localStorage.write('jwt_token', token);
    await _localStorage.write('user_data', jsonEncode(user.toJson()));

    return Right(user);
  }

  @override
  Future<Either<Failure, ResidentEntity>> register(RegisterParams params) async {
    await Future.delayed(_delay);
    return const Left(
      BusinessLogicFailure('Registro deshabilitado en modo demo. Use credenciales admin.'),
    );
  }

  @override
  Future<Either<Failure, void>> logout() async {
    await Future.delayed(const Duration(milliseconds: 200));
    await _localStorage.delete('jwt_token');
    await _localStorage.delete('user_data');
    return const Right(null);
  }

  @override
  Future<Either<Failure, ResidentEntity?>> getCurrentUser() async {
    final userJson = await _localStorage.read('user_data');
    if (userJson == null) return const Right(null);
    try {
      final user = ResidentEntity.fromJson(jsonDecode(userJson));
      return Right(user);
    } catch (_) {
      return const Right(null);
    }
  }

  /// Genera JWT local para demo (firma dummy - NO usar en producción)
  String _generateLocalToken(ResidentEntity user) {
    final header = base64Encode(utf8.encode(jsonEncode({'alg': 'HS256', 'typ': 'JWT'})));
    final payload = base64Encode(utf8.encode(jsonEncode({
      'sub': user.id,
      'email': user.email,
      'role': user.role.name,
      'exp': DateTime.now().add(const Duration(days: 7)).millisecondsSinceEpoch,
    })));
    // Firma dummy (no es criptográficamente segura, solo para demo)
    final signature = base64Encode(utf8.encode('urbania_demo_secret'));
    return '$header.$payload.$signature';
  }
}
```

---

## 4. Persistencia Local (Hive + Drift)

### Hive (Key-Value)
```dart
// /core/storage/hive_storage.dart
class HiveStorage {
  static late Box<String> _sessionBox;
  static late Box<dynamic> _settingsBox;

  static Future<void> init() async {
    await Hive.initFlutter();
    _sessionBox = await Hive.openBox<String>('session');
    _settingsBox = await Hive.openBox<dynamic>('settings');
  }

  Future<void> write(String key, String value) => _sessionBox.put(key, value);
  Future<String?> read(String key) async => _sessionBox.get(key);
  Future<void> delete(String key) => _sessionBox.delete(key);
}
```

### Drift (SQLite estructurado)
```dart
// /core/database/app_database.dart
@DriftDatabase(tables: [
  Residents,
  Reservations,
  Payments,
  Pqrs,
  Notifications,
  ChatMessages,
  CommonZones,
])
class AppDatabase extends _$AppDatabase {
  AppDatabase() : super(impl.connect());

  @override
  int get schemaVersion => 1;

  // Seeding inicial con datos demo
  Future<void> seedDemoData() async {
    await batch((batch) {
      batch.insertAll(residents, DemoData.demoResidents.map((r) => r.toCompanion()).toList());
      batch.insertAll(reservations, DemoData.demoReservations.map((r) => r.toCompanion()).toList());
      // ... resto de tablas
    });
  }
}
```

---

## 5. Simulación de Errores (Testing)

```dart
// /core/demo/demo_error_simulator.dart
class DemoErrorSimulator {
  static bool _shouldFail = false;
  static double _failureRate = 0.0;

  /// Activa simulación de errores para probar manejo de errores
  static void setFailureRate(double rate) => _failureRate = rate;

  static Future<void> maybeFail() async {
    if (_shouldFail || (_failureRate > 0 && Random().nextDouble() < _failureRate)) {
      await Future.delayed(const Duration(milliseconds: 400));
      throw const ServerFailure();
    }
  }
}
```

---

## 6. Checklist Demo por Feature

| Feature | Datos Mock | Persistencia | Funciona Offline |
|---------|-----------|--------------|------------------|
| Auth | Credenciales hardcodeadas | Hive (token) | Sí |
| Home Dashboard | Métricas calculadas | Drift | Sí |
| Profile | Residente actual | Drift | Sí |
| Reservations | Lista + CRUD | Drift | Sí |
| Payments | Historial + estados | Drift | Sí |
| PQRS | Lista + creación | Drift | Sí |
| Notifications | Lista local | Drift | Sí |
| Chat | Mensajes demo | Drift | Sí |

---

## 7. Migración a API Real (Checklist)

- [ ] Crear `RemoteDatasource` con Dio
- [ ] Implementar `NetworkInfo` (connectivity_plus)
- [ ] Crear `SyncEngine` para reconciliar local/remoto
- [ ] Reemplazar `FakeRepository` -> `RemoteRepository` en providers
- [ ] Activar `flutter_secure_storage` para tokens reales
- [ ] Implementar refresh token
- [ ] Agregar `WorkManager` para sync background
- [ ] Eliminar `DemoCredentials` y `DemoErrorSimulator`
- [ ] Configurar SSL pinning
- [ ] Implementar rate limiting y retry policy


---

## Nota sobre API de Faker (Dart)

El paquete `faker` de Dart tiene una API diferente a la de JavaScript. Métodos disponibles:

| Método | Uso | Ejemplo |
|--------|-----|---------|
| `integer(max, {min})` | Entero aleatorio | `faker.randomGenerator.integer(100, min: 1)` |
| `numberOfLength(length)` | String numérico | `faker.randomGenerator.numberOfLength(9)` |
| `decimal({scale, min})` | Decimal aleatorio | `faker.randomGenerator.decimal(scale: 2, min: 0)` |
| `boolean()` | Booleano aleatorio | `faker.randomGenerator.boolean()` |
| `element(list)` | Elemento de lista | `faker.randomGenerator.element(['a', 'b'])` |

> **NO usar**: `numberBetween()` (no existe en la versión Dart).
