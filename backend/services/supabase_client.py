from supabase import create_client
from config import Config

# Initialize Supabase client
supabase = create_client(Config.SUPABASE_URL, Config.SUPABASE_KEY)

class SupabaseService:
    @staticmethod
    def get_client():
        return supabase
    
    @staticmethod
    def insert_data(table, data):
        try:
            result = supabase.table(table).insert(data).execute()
            return {"success": True, "data": result.data}
        except Exception as e:
            return {"success": False, "error": str(e)}
    
    @staticmethod
    def get_data(table, filters=None):
        try:
            query = supabase.table(table).select("*")
            if filters:
                for key, value in filters.items():
                    query = query.eq(key, value)
            result = query.execute()
            return {"success": True, "data": result.data}
        except Exception as e:
            return {"success": False, "error": str(e)}
    
    @staticmethod
    def update_data(table, data, filters):
        try:
            query = supabase.table(table).update(data)
            for key, value in filters.items():
                query = query.eq(key, value)
            result = query.execute()
            return {"success": True, "data": result.data}
        except Exception as e:
            return {"success": False, "error": str(e)}